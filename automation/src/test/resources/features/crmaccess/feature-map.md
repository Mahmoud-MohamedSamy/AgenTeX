# crmaccess — CRM access and security (go-live Wave 1)

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI CRM staging-crm.taviportal.com · Reference: Zoho CRM org943261092 (read-only) · Created 2026-10-25
> Plan + report: `executions/execu_2026-10-25_crm-golive-wave1/` (plan-v2-full-feature.md, report.md, baseline/, after/)

## How to run
| What | Command (from automation/) |
|---|---|
| All API classes, one JVM, one sign-in per user | `./mvnw test -Dsuite=crm-wave1-api` (SessionPolicyTest is last and TENANT-WIDE — ask first) |
| Field permissions / audit / login history / users / teamspace / invites | `-Dtest=FieldPermissionTest` … `-Dtest=InviteTest` (InviteTest mails hmohamed@anyware.software — ask first) |
| Owner screens | `-Dtest=AccessScreensUiTest -Dbase.url=https://staging-crm.taviportal.com "-Dcredentials.file=../docs/Credentials/Microsoft Edge Passwords.csv" -Dcredentials.host=staging-crm.taviportal.com -Dcredentials.account=ndc-staging-owner@taviportal.com` |
| Restricted-user screens | same flags with `-Dcredentials.account=nameb56175@airhemp.com` |
Hierarchy screens/visibility live in feature `crmhierarchy` (rerun all three classes one at a time).

## API (all under /api/v1, owner unless noted)
| Area | Calls |
|---|---|
| Profiles | `POST /iam/profiles {name,parent_profile_id,rank,is_tenant_wide,source_profile_id,app_key}` · `PATCH/DELETE /iam/profiles/{id}` · `GET/POST /iam/profiles/{id}/permissions {permission_key, effect:"GRANT"}` (upper case) |
| Field permissions | `POST /modules/{m}/field-permissions {fieldId,profileId,permission: hidden|read_only|read_write}` → row id · `DELETE …/{row}` · `GET …/effective` (as the user; names fields by key) |
| Users | `PATCH /iam/users/{id} {status:"Suspended"|"Active"}` · `{org_unit_id}` (org unit ≠ profile scope) · `POST /iam/users/{id}/profiles {profile_id,scope_id,replace}` |
| Overrides | `POST /iam/users/{id}/overrides {permission_key,effect,reason}` · `DELETE …/{key}` · `GET …/history?take=` |
| Invites | `POST /iam/users/invite {email,profile_id,lifetime_days,display_name,org_unit_id}` · `/invite/bulk {invitations:[…]}` (per-row results) · `POST /iam/users/invitations/{id}/resend|cancel` |
| Org units | `POST /iam/org-units {parent_id,name,app_key}` · `PATCH {name}|{new_parent_id}` · `DELETE` (409 children / users) |
| Teamspaces | `POST /teamspaces {name,slug,description}` · `PUT /teamspaces/{id}/acl {rows:[{principal_kind,principal_id,permission_key,access_level: admin|access}]}` · `PATCH …/access-mode {access_mode:"selected"}` · `DELETE ?cascade=true` |
| Audit | `GET /audit/events?app_key=crm|iam|metadata-engine&limit=` (`data` array: action, target_type, target_id, actor_id, changes) · `/audit/events/facets` |
| Login history | `GET /audit/login-history?status=active&user_id=&limit=` (`data` array, cursor in `meta.next_cursor`; may contain null rows) · `POST …/{session}/clear` · `/clear-all {user_ids}` · `GET …/export` |
| Session policy | `/settings/resolved?app_key=iam&key=iam.security.session.{idle_timeout_minutes|absolute_timeout_minutes|max_concurrent}&scope_type=Org` · `PUT /settings/values {…, expected_version}` (baseline 25 Oct: 60 / 720 / 20) |
| Personal | `GET/PUT /iam/me/profile` · `POST /iam/me/password {current_password,new_password,confirm_password}` |

## Traps
- base.url in config.properties is the Desk host: screen runs need `-Dbase.url=https://staging-crm.taviportal.com`.
- Headings/badges are CSS-capitalised: compare text case-insensitively. The Users search box is "Search by email…"; the Setup sidebar also has a search box.
- The Leads record page shows "Loading layout…" well after the title: wait for it before reading field values.
- "Comment" (lead_status_comment) is not on the Leads create form for anyone — use Email for read-only screen checks.
- Sign-ins are rate-limited (429) per account: run API classes in the suite (one sign-in per user) and avoid repeated fresh `Session.signIn`.
- Audit "view own" still answers 200 when view-all is denied — check the rows, not the status.
- Session-policy tests can end the owner session that has to restore the limit: SessionPolicyTest keeps the owner busy and falls back to a fresh owner sign-in.

## Test inventory (last result 25 Oct 2026)
| Class | Cases | Last result |
|---|---|---|
| FieldPermissionTest | B-0, B-3a/b/c (NDC-1337) | 4 pass |
| AuditLogTest | C-1 (NDC-2381), C-2, C-2b (NDC-1343), C-3 (NDC-2293) | 4 pass |
| LoginHistoryTest | D-1 (NDC-2418), D-2 (NDC-613), D-4 | D-1 **fail**, 2 pass |
| UsersProfilesTest | E-1 suspend, E-2 profile lifecycle, E-3 override history | 3 pass |
| TeamspaceAccessTest | F-1a (NDC-1172), F-1b (NDC-1699), F-1c (NDC-1701) | 3 pass |
| AdminApiTest | US-06 **fail (W1-B1)**, US-07, US-15, US-16, PR-03, PR-05, PR-06 **fail (W1-B2)**, PE-05, OU, AU-07/LH-06, SP-02, PS-01, PS-05 | 11 pass, 2 fail |
| InviteTest | US-03/05, US-04 | 2 pass |
| SessionPolicyTest | SP-03, SP-04 (tenant-wide) | inconclusive (429; idle test design) |
| AccessScreensUiTest (owner) | US-01/02, US-10, PR-01/PE-01/PE-03, OU-01, SP-01, LH-01/05, AU-05/06, PS pages, RC-01, HP-new, FP-control | all pass except FP-control (Comment not on form — control finding) |
| RestrictedUserUiTest (test user 1) | FP-04, FP-05, LH-07/US-16/PR-08/SP-05 | 3 pass |

## Open bugs covered
| Bug | Test | Status |
|---|---|---|
| NDC-2418 expired sessions Active | D-1 | open (306/346) |
| W1-B1 invitation lifetime not validated | US-06 | new, not in Plane |
| W1-B2 built-in User profile renamable | PR-06 | new, not in Plane |

## Run history
| Date | Scope | Passed | Failed | Healed | Notes |
|---|---|---|---|---|---|
| 2026-10-25 | Wave 1 full feature | 42 | 3 (+2 inconclusive) | 1 (byText promoted text() xpath) | all changes restored, diff clean |
