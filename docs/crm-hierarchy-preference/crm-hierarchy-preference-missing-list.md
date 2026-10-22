# CRM Hierarchy Preference (Role-based / Reporting-based) — missing list vs Zoho CRM

Date: 21 Oct 2026 · TAVI CRM staging `https://staging-crm.taviportal.com` (tenant NDC-Staging) · Zoho CRM org943261092 (Enterprise-level, read-only)
PRD: **none found in Plane** (searched NDC for hierarchy / reporting manager / reports to / roles / data sharing). Related Desk items: NDC-2300 (Share data with peers has no effect), NDC-2299, NDC-2301.
Nothing was changed on TAVI or Zoho during this intake (the switch dialog was opened and cancelled; the value is still `role`, version 2).

Sources: bundle scan (350 chunks), live API (owner), TAVI screenshots `evidence/originals/tavi-*`, Zoho screenshots `evidence/originals/zoho-*`, Zoho docs inventory `reference/zoho-docs-inventory.md` (≈130 items with URLs), baseline `reference/tavi-baseline-2026-10-21.json`.

## What TAVI ships today

| Area | TAVI CRM | Where |
|---|---|---|
| Setting | `general.company.hierarchy.preference` = `role` \| `reporting`, scope Org, versioned (`version` 2 today; history shows reporting→role on 28 Sep) | `GET /settings/resolved`, `PUT /settings/values`, `GET /settings/history` |
| Page | Company Settings → **Hierarchy Preference** tab: two cards (Role-based "Visibility follows the profile rank hierarchy", Reporting-based "Visibility follows the reporting-manager chain"), confirm dialog "Switch hierarchy mode?", version-conflict message, **Change history** list, **Live preview** (info icon) | `/settings/company/hierarchy-preference` |
| Permission | `iam.company.hierarchy_preference.manage` (deny page "Only tenant administrators can change this setting.") | |
| "Roles" | No role object. **Profiles** carry `rank` + `parentProfileId` (CRM Admin 700 → Manager 500 → Supervisor 300 → User/test/mahmoud 100). **Org Units** are a separate tree (Organization → HR/Sales → Team 1–3) used for scope | `/settings/security/profiles`, `/settings/security/org-units` |
| Reporting manager (admin) | Users → user modal → **Reporting manager** select (all users except self) + Save; "loops in the chain are rejected"; permission `iam.user.reporting_manager.assign` | `PATCH /iam/users/{id}/reporting-manager` |
| Reporting manager (self) | Personal Settings → **Reporting Hierarchy**: "Reporting manager (user ID)" **free-text** field + "Your direct reports" list. Menu item and route only exist in Reporting mode (in Role mode the URL redirects to `/settings`) | `/settings/personal/reporting-hierarchy`, `GET /iam/me/subordinates` |
| Record visibility | Per module: CRM offers **Public** or **Hierarchy** ("Users see their own records and those of lower-ranked users in their department. Unassigned records are visible to everyone. Admins see all."). Today Leads = hierarchy, all other 7 modules = public | Modules → module permission modal; `GET /modules` `recordVisibility` |
| Used by | Approval processes: "Manager" and "submitter's manager" approvers; Assignment rules: "Reporting Manager" criteria field; Audit log labels the setting | |
| Extras Zoho doesn't have | Change history on the page, live preview, version-conflict guard, confirm dialog | |

## Missing — settings page

1. **Who manages records of users with no manager** (Reporting mode only). Zoho shows a second choice under Reporting Hierarchy: "Any user higher up in the hierarchy" or "Super admin and Administrators". TAVI has no such option.
2. **Switching back from Reporting to Role does not warn where "Reporting To" is used.** In Zoho a popup lists each report, criteria, filter and merge field that uses "Reporting To", and you choose to keep or remove each one. TAVI shows the same generic "Switch hierarchy mode?" text both ways.

## Missing — role hierarchy

3. **No role tree.** Zoho has Roles (CEO → Manager → …) under Roles and Sharing, separate from Profiles (permissions). TAVI's Role-based mode uses **profile rank**, so a permission profile also decides who sees what. Users with two profiles (e.g. "CRM Admin, Desk Administrator") have no single clear rank.
4. **A superior sees only their own branch** in Zoho. TAVI's preview says "A Manager sees every User in the tenant, regardless of who they report to" (rank only, tenant-wide). The record-visibility hint instead says "lower-ranked users in their department". The two TAVI texts disagree, and neither matches Zoho's branch rule.
5. **Share Data with Peers** (per role, off by default; users in the same role see each other's records). Missing in CRM. Desk has the flag, but NDC-2300 says it has no effect there.
6. **Delete a role by moving its users and sub-roles first** ("Transfer & Delete"). TAVI profiles have Delete, but there is no transfer step. To be confirmed in the run.

## Missing — reporting hierarchy

7. **The manager must hold a higher role.** Zoho only offers users in a superior role. TAVI's admin dropdown lists every user except the user themselves, so a "User" can be made manager of a "CRM Admin".
8. **No user picker on the Personal Settings page.** The field is "Reporting manager (user ID) — Paste a user ID". In Zoho the manager is chosen from a list in the user's details by an admin.
9. **No hierarchy view on the user's details.** Zoho's user page has a "Reporting Hierarchy" section with the manager and the direct reports. TAVI's admin modal shows only the manager select. The Users list has no "Reports To" column or filter.
10. **Deleting or deactivating a manager does not ask what happens to their reports.** Zoho asks you to move the subordinates to another user (equal or higher role) or leave them with no manager. To be confirmed in the run.
11. **Changing a manager's role does not check their reports.** Zoho shows "Change of Reporting manager" when a demotion breaks the chain.

## Missing — where the hierarchy is used

12. **"Reporting To" in reports, custom-view criteria, filters and merge fields** (Reporting mode). None of these in TAVI; the only place is Assignment-rule criteria.
13. **Workflow email alert to "Record Owner's Manager" / subordinates** (`${!Module.Owner.Reporting_To}`). Not in TAVI workflow actions.
14. **Blueprint transition owner "Reporting Manager".** Not in TAVI blueprints.
15. **Approval "levels" up the hierarchy** (1st, 2nd or 3rd level, or all up to the 2nd or 3rd) and the fallback when the owner has no manager, which follows item 1. TAVI has "Manager" and "submitter's manager" only, and they work in both modes. Levels to be confirmed in the run.

## Missing — data sharing

16. **Default access per module.** Zoho has Private, Public Read Only, Public Read/Write and Public Read/Write/Delete. TAVI CRM has Public or Hierarchy only. "Public Read Only" exists in Desk but not in CRM.
17. **Sharing rules** (owner-based or criteria-based, from/to role, role + subordinates, or group, plus "Superiors Allowed"). There is no page, and `/iam/sharing-rules` and `/settings/data-sharing` return 404.

## Missing — API

18. **No roles API.** Zoho has `GET/POST/PUT/DELETE /settings/roles` with `reporting_to`, `share_with_peers`, and `?transfer_to_id` on delete. In TAVI, `/iam/roles` and `/iam/hierarchy` return 404, and only profiles are served.
19. **Only your own subordinates can be read.** There is `GET /iam/me/subordinates`, but `/iam/users/{id}/subordinates` returns 404, and `GET /iam/users/{id}` returns 405.

## Not gaps
- Forecast hierarchy and territories: TAVI CRM has no Forecasts or Territories module, so these are outside this feature.
- Zoho has no change history, live preview or confirm dialog on this page. TAVI has all three (TAVI extra).
- Zoho also keeps the reporting manager value when you switch to Role mode, the same as TAVI ("Existing manager and role assignments still apply").

## Could not be checked yet (Phase 3 needs these)
- **Whether switching the mode changes what users see at all.** This needs the mode switched and a second user signed in. You approved changes and the setting will be set back. Test users exist: valafo4080 (profile test, reports to Mahmoud Samy, HR) and nameb56175 (User, Sales, has a manager).
- **Zoho's Reporting-mode screens** (the item 1 sub-option, the item 2 popup, the user "Reporting Hierarchy" section, manager options). These only appear after switching Zoho org943261092 to Reporting Hierarchy. **I need your OK to switch Zoho and switch it back.**
- Items 6, 10, 11, 15 need write actions (delete a QA profile, deactivate a QA user, change a role, build a QA approval process).

## Possible bugs to check separately (not gaps)
- The preview text ("every User in the tenant") and the Hierarchy record-visibility hint ("lower-ranked users in their department") disagree.
- A user can set their own manager by pasting any ID on the Personal page (who is allowed, self as manager, a deleted user, a user in another tenant, loops).
- The Reporting manager section and API work in Role mode too, which is harmless, but the self-service page disappears.
- Change history shows the value and time but not who made the change (`changed_by` is in the API).
- ~~The Users list shows 9 users while `GET /iam/users` returns 16.~~ **Withdrawn 21 Oct 2026:** the 7 extra are Desk-only users; the list and the manager dropdown both show the 9 CRM users.

## Run 21 Oct 2026 (Phase 3) — see `executions/execu_2026-10-21_crm-hierarchy-preference/report.md`
- **Switching the mode changes nothing users can see** (bugs HP-01, HP-02): in both modes a Hierarchy module shows each user only their own records; superiors and reporting managers get 403.
- New: HP-03 (Desk Administrator grants CRM view-all), HP-04 (history without "who", confirmed), HP-05 (own manager changed through `PUT /iam/me/profile` without the permission).
- Item 1 now has live Zoho evidence (Reporting picked, not saved). Items 2, 7 (Zoho side) and 9 stay docs only: saving Zoho was not allowed.
