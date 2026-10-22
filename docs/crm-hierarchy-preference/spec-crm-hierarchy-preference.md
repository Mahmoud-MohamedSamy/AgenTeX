# Spec — CRM Hierarchy Preference (Role-based / Reporting-based)

| | |
|---|---|
| App | TAVI CRM `https://staging-crm.taviportal.com` (tenant NDC-Staging, `a7a7a7a7-0000-0000-0000-000000000004`) |
| Feature | Company Settings → **Hierarchy Preference** tab (`/settings/company/hierarchy-preference`): Role-based / Reporting-based. Also everything the mode drives or depends on: profile rank (TAVI's "roles"), the user's **Reporting manager** (admin Users modal and Personal Settings → Reporting Hierarchy), per-module **Record visibility** (Public / Hierarchy), and the consumers (approvals, assignment rules) |
| Focus | Functional · what each user really sees in each mode · API · UI / UX. Security, i18n, accessibility, performance and compatibility in a short Group L |
| Plane | PRD: **none found** (NDC searched 21 Oct 2026 for hierarchy, reporting manager, reports to, roles, data sharing). Related Desk items: NDC-2300 (Share data with peers has no effect), NDC-2299, NDC-2301. Gap item: **not filed yet**. Draft in `plane-draft/description.html`; the user files it later |
| Missing list | `docs/crm-hierarchy-preference/crm-hierarchy-preference-missing-list.md` (19 items = Z1–Z19), approved by the user 21 Oct 2026 |
| Gap evidence | `docs/crm-hierarchy-preference/evidence/01…04-*-vs-zoho.png` |
| Expected behaviour | No PRD. Expected results come from: (1) TAVI's own on-screen texts (quoted in §2.3), (2) Zoho CRM behaviour (`reference/zoho-docs-inventory.md` and live Zoho org943261092), (3) common sense for save / security rows. Where TAVI's texts disagree with each other (§2.3 note), the row records what really happens and flags the text |
| Reference | `reference/zoho-docs-inventory.md` (≈130 Zoho items with URLs) · `reference/tavi-baseline-2026-10-21.json` (preference `role`, version 2) · live Zoho CRM org943261092 (Role Hierarchy, read-only) |
| Written | 21 Oct 2026, from the CRM bundle (350 chunks), the locale files `iam` and `crm-modules`, the live API (GET only) and the UI, as the owner |
| Status | **Draft for review. Do not run until the user says so** |

---

## Feature inventory

### Built (found 21 Oct 2026)
- **The setting.** `general.company.hierarchy.preference` = `role` | `reporting`, scope Org, versioned with `expected_version`, with history. Covered by B, C, D.
- **The tab.** Two mode cards, a confirm dialog, success / error / version-conflict messages, a "Your saved mode" line, Change history and a Live preview. Covered by B, C, D.
- **Role-based = profile rank.** CRM profiles carry `rank` and `parentProfileId` (CRM Admin 700 → Manager 500 → Supervisor 300 → User / test / mahmoud 100). Rank rules on the Profiles page. Covered by E, I.
- **Reporting manager (admin).** Users → user modal → Reporting manager select, "No manager (clear)", Save; loops rejected. `PATCH /iam/users/{id}/reporting-manager`. Covered by F.
- **Reporting manager (self).** Personal Settings → Reporting Hierarchy: free-text user ID + "Your direct reports". Only in Reporting mode. `PUT /iam/me/profile`, `GET /iam/me/subordinates`. Covered by G.
- **Record visibility per module.** CRM: Public / Hierarchy (Desk adds Public Read Only). Today Leads = Hierarchy, the other 7 modules = Public. Covered by H, I, J.
- **Consumers.** Approval processes ("Manager", "submitter's manager" approvers), assignment-rule criteria ("Reporting Manager"), audit log. Covered by K.

### Missing (Group Z)
- 19 items: settings page Z1–Z2, role hierarchy Z3–Z6, reporting hierarchy Z7–Z11, where it is used Z12–Z15, data sharing Z16–Z17, API Z18–Z19.
- No PRD, so no phase mapping. Each Z row states the Zoho behaviour as the expected result.

### Not a gap
- Forecast hierarchy and territories: TAVI CRM has no Forecasts or Territories module.
- Zoho has no change history, live preview or confirm dialog on this page. TAVI has all three (TAVI extra).
- Zoho keeps the reporting manager value when you switch to Role mode, the same as TAVI ("Existing manager and role assignments still apply").

### Not yet confirmed (tested here, verdict unknown)
- **Whether the mode changes what users see at all** (I, J). The core question of this spec.
- Which rule Role mode really uses: tenant-wide rank (preview text), rank within department / org unit (Hierarchy hint), or Zoho's branch rule (I3–I6).
- Zoho Reporting-mode screens (Z1, Z2, Z7, Z9). Need the user's OK to switch Zoho org943261092 and switch it back.
- Z6, Z10, Z11, Z15 need write actions on QA data.

---

## 0 How to run

1. **Order:** §1 preconditions → A (read) → B → E (read) → H (read) → **write window, serial**: C → D → F → G → H-write → I → J → K → back to `role` → L → E2E → Z. Take the baseline (§1.3) before A and diff it after the last group.
2. **The setting is tenant-wide.** Every C, D, I, J, E2E row that switches the mode changes visibility for **everyone on NDC-Staging**. The user approved changes on 21 Oct 2026 as long as everything is set back. Keep each window in Reporting mode short and set `role` back at the end of every group, not only at the end of the run.
3. **Serial only:** every row that writes the preference, a reporting manager, a profile rank or a module's record visibility. Never two of them at once.
4. **Parallel allowed:** A reads, B, E / H read rows, API GET rows, Group Z checks.
5. **Exclusive:** `[perf]` rows run alone.
6. **`[data]` rows** record: field, value (exact bytes for odd input), what the UI showed, what the API stored (GET after save).
7. **Visibility rows (I, J)** read the verdict from **both** the UI list and the API list for the signed-in user, and always include a **control**: a record the user must see (their own QA lead). If the control is missing, the session is wrong — mark **Inconclusive**, never Pass.
8. **Sessions:** one browser context per user. The access token lasts 5 minutes and the refresh token rotates on every use; save it after each refresh. On HTTP 429 or a rejected login, **stop and tell the user**. Report token **lengths** only.
9. **Tools on this machine:** In Git Bash set `MSYS_NO_PATHCONV=1` before passing `/settings/...` paths. Every API call needs `x-tenant-id` and `x-app-key: crm`.
10. **Verdicts:** Pass, Fail, Blocked or Inconclusive. A row blocked by §1.4 is **Inconclusive, not Fail**.
11. **Evidence:** screenshots only for **failed** rows, side by side against live Zoho where Zoho has the behaviour (TAVI left, Zoho right, numbered boxes, table Behaviour | Zoho | TAVI | Match). Passed rows get a verdict and one line of text.

---

## 1 Preconditions

### 1.1 Accounts
| Role | Account | Profile / rank | Org unit | Manager today | Use |
|---|---|---|---|---|---|
| Owner (admin) | `ndc-staging-owner` (`97be04b6-…`), Edge CSV | Owner | Organization | none | All write rows. Shared with teammates — §0.2 |
| User A 🔒 | `valafo4080` (`51666421-…`), Edge CSV | test, 100 | HR | Mahmoud Samy (`d23fb4e0-…`, Supervisor 300) | I, J, G rows as a normal user |
| User B 🔒 | `nameb56175` (`45ffbc5b-…`), Edge CSV | User, 100 | `60aeb9ce-…` | `155208be-…` (CRM Admin) | I, J rows as a peer of A |
| Supervisor 🔒 | Mahmoud Samy (`d23fb4e0-…`) | Supervisor 300, Desk Administrator | `60aeb9ce-…` | none | I3–I6 (a superior). **Credentials not confirmed** — §1.4 |
| Second admin | "Mahmoud TAVI" (`7e5e7c27-…`, CRM Admin) | 700 | Organization | none | D3–D5 two-tab rows |
| User of another tenant | any throwaway tenant | — | — | — | L4 only |
| Zoho reference | Row 1 of `docs/Credentials/Zoho Desk Credentials.csv`, Edge, **read only** unless the user approves Z1/Z2/Z7/Z9 | — | — | — | Side-by-side evidence |

User A and User B are both rank 100 (peers). In the baseline, A and B have **different** managers. Rows that need A as B's manager set it and restore it (§1.3).

### 1.2 Test data
- Prefix every record the run creates with **`QA HP `**: lead `QA HP A-own`, `QA HP B-own`, `QA HP Sup-own`, `QA HP Unassigned`; profile `QA HP Profile`; approval process `QA HP Approval`; assignment rule `QA HP Rule`.
- Leads are the test module, because Leads already uses **Hierarchy** visibility. Create one QA lead owned by each test user, plus one with no owner, through the owner account (owner field set), before group I.
- One **Public** module for control rows: Contacts (`recordVisibility: public`). One QA contact owned by User B.

### 1.3 Baseline (restore point)
Saved 21 Oct 2026 in `reference/tavi-baseline-2026-10-21.json`. Refresh it into the run's `baseline/` before group A:
- `GET /settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org` → `value_json "role"`, `version` 2.
- `GET /settings/history?...&limit=10` → 2 items (28 Sep 2026: null → reporting, reporting → role).
- `GET /iam/profiles` (CRM): name, rank, parentProfileId.
- `GET /iam/org-units` (CRM).
- `GET /iam/users?limit=100` → `reportingManagerId` per user (only A → `d23fb4e0` and B → `155208be` are set).
- `GET /modules` → `recordVisibility` per module (Leads = hierarchy, 7 others = public). **Add this to the baseline file before the run.**

**Revert:**
- Preference back to `role` with one `PUT /settings/values` (current `expected_version`). The version number will be higher than 2; that is expected.
- Every reporting manager back to its baseline value (`PATCH /iam/users/{id}/reporting-manager`).
- Every module's record visibility back to its baseline value.
- Every profile rank / parent back to its baseline value; delete `QA HP Profile`.
- Delete every `QA HP` record, approval process and assignment rule; purge them from the Recycle Bin.
- Prove it with the final diff (see Reporting).

### 1.4 Environment blockers
| Blocker | Rows affected | Action |
|---|---|---|
| No signed-in superior account confirmed (Supervisor / Manager credentials) | I3–I6, J4 | Ask the user for a Supervisor-rank account, or approve giving User A the Supervisor profile for the window and setting it back |
| Zoho in Role Hierarchy only | Z1, Z2, Z7, Z9 | Ask the user to approve switching Zoho to Reporting Hierarchy and back. Until then, the Zoho side is "docs only" |
| Only one tenant | L4 | Inconclusive until a second tenant exists |
| Teammates use NDC-Staging | every write row | Keep Reporting-mode windows short; set `role` back after each group |

### 1.5 Things that cannot be undone cleanly
- Each switch adds rows to Change history and the audit log, and raises the setting's `version`. They cannot be removed.
- Records deleted go to the Recycle Bin; purge them there.
- Notifications or approval requests already sent by QA approval processes cannot be recalled.

---

## 2 Surface and contract

### 2.1 API (base `/api/v1`, headers `Authorization: Bearer …`, `x-tenant-id`, `x-app-key: crm`). Envelope `{success, data, error:{code,message,details}, meta}`
| Method | Path | Body / notes | Priority |
|---|---|---|---|
| GET | `/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org` | `value_json`, `version`, `resolved_from` | **High** |
| PUT | `/settings/values` | `{app_key:"general", key:"general.company.hierarchy.preference", scope_type:"Org", scope_id:null, value_json:"\"reporting\"", expected_version:<n>}` → `data.new_version` | **High** |
| POST | `/settings/resolved-batch` | the page's batch read | Medium |
| GET | `/settings/history?app_key=general&key=…&scope_type=Org&limit=10` | `changed_at`, `changed_by`, `old_value`, `new_value` | Medium |
| PATCH | `/iam/users/{id}/reporting-manager` | `{reporting_manager_id: <uuid> \| null}`; loops rejected | **High** |
| GET / PUT | `/iam/me/profile` | `reporting_manager_id` (self page saves with PUT) | **High** |
| GET | `/iam/me/subordinates` | direct reports of the signed-in user | **High** |
| GET | `/iam/users?limit=100` | `reportingManagerId`, `profileNames`, `orgUnitId` | **High** |
| GET | `/iam/profiles` | `rank`, `parentProfileId`, `isSystem` | Medium |
| GET | `/iam/org-units` | separate tree, used for scope | Low |
| GET | `/modules` and `/modules/{id}` | `recordVisibility` | **High** |
| — | `/iam/roles`, `/iam/hierarchy`, `/iam/users/{id}/subordinates`, `/iam/me/manager`, `/settings/data-sharing`, `/crm/settings/data-sharing`, `/iam/data-sharing`, `/iam/sharing-rules`, `/settings/definitions` | **404** on 21 Oct 2026. `GET /iam/users/{id}` → 405 | Z18, Z19 |

Permissions: `iam.company.hierarchy_preference`, `iam.company.hierarchy_preference.manage`, `iam.personal.reporting_hierarchy`, `iam.user.reporting_manager.assign`.

### 2.2 Field register
| Field | Kind | Rules |
|---|---|---|
| Hierarchy mode | 2 cards (radio) | `role` / `reporting`. Switching asks for confirmation. Any other value must be rejected by the API (C8) |
| `expected_version` | integer | must equal the current version; stale → conflict message (D3) |
| Reporting manager (admin) | select | all users except self, plus "No manager (clear)". Loops rejected. Zoho: only users in a higher role (Z7) |
| Reporting manager (self) | free text | "Paste a user ID, or leave empty for no manager". No format rule shown — find it (G4–G8) |
| Profile rank | number | "Higher rank = more authority. Must be lower than the parent profile's rank." Max = actor's effective rank |
| Profile parent | select | "Only profiles ranked higher than this one can be selected as parent." |
| Record visibility (CRM module) | radio | Public / Hierarchy (Desk adds Public Read Only) |

### 2.3 Page states and messages (en, verbatim)
- Title / subtitle: "Hierarchy Preference" / "Choose how visibility flows across your organisation."
- Loading: "Loading hierarchy preference…"
- Mode block: "Hierarchy mode" / "Switching changes how visibility flows. Existing manager and role assignments still apply."
- Cards: "Role-based" — "Visibility follows the profile rank hierarchy." · "Reporting-based" — "Visibility follows the reporting-manager chain."
- Confirm: "Switch hierarchy mode?" / "Switching changes how visibility flows. Existing manager and role assignments still apply." [Switch mode]
- Toasts: "Hierarchy preference updated" · "Couldn't update hierarchy preference." · "Hierarchy preference was changed elsewhere. Refresh and try again."
- Denied: "You don't have permission to change the hierarchy preference" / "Only tenant administrators can change this setting."
- Live preview: "How visibility flows under each mode. The active mode is highlighted; the inactive mode is dimmed." Role: "By profile rank." — "A Manager sees every User in the tenant, regardless of who they report to." Reporting: "By reporting-manager chain." — "Sara sees Omar (her report) but not Lina, who reports to a different manager." · "Your saved mode:"
- Admin modal: "Reporting manager" · "No manager (clear)" · "Reporting manager set to {{manager}}." · "Reporting manager cleared." · "Failed to set the reporting manager" · note "Sets who this user reports to. Approval processes use it to resolve the Manager and submitter's-manager approvers. Saving replaces any existing manager; loops in the chain are rejected."
- Personal page: "Reporting Hierarchy" / "Manage your manager and view your direct reports." · "Your manager" · "Reporting manager (user ID)" · "Paste a user ID, or leave empty for no manager" · "Your direct reports" · "You don't have any direct reports yet." · "Save changes" · "Reporting manager updated" · "Couldn't update reporting manager." · denied "You don't have permission to change your reporting manager" / "Ask a tenant administrator to grant the required permission."
- Record visibility hints: Public "Everyone with module access sees all records." · Hierarchy "Users see their own records and those of lower-ranked users in their department. Unassigned records are visible to everyone. Admins see all."

**Note:** the Role preview says "every User in the tenant", the Hierarchy hint says "lower-ranked users in their department", and the Hierarchy hint does not mention the reporting chain at all. Group I decides which one is true; the others are logged as text bugs.

### 2.4 Data classes
Use `Suit 1/_COMMON.md` §5 (D1–D20) for the free-text manager ID (G4–G8) and the API body (C8, L2): empty, spaces, valid UUID of each kind of user, malformed UUID, very long string, SQL / script text, another tenant's UUID, a deleted user's UUID, self, numbers, JSON types (number, object, array, null).

---

## Group A — Access and permissions

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| A1 | Owner opens the tab | Owner → Settings → Company → Hierarchy Preference | Page loads, both cards, current mode highlighted, history and preview visible | `[func]` `[ui]` |
| A2 | Direct URL as owner | Open `/settings/company/hierarchy-preference` | Same page, Hierarchy Preference tab active | `[func]` |
| A3 | Normal user, no manage permission 🔒 | User A opens the URL | Denied state "You don't have permission to change the hierarchy preference" / "Only tenant administrators can change this setting." or read-only; cards cannot be changed | `[sec]` `[ui]` |
| A4 | Normal user writes by API 🔒 | User A: `PUT /settings/values` to `reporting` | 403; value and version unchanged (GET) | `[sec]` `[api]` |
| A5 | Normal user reads by API 🔒 | User A: `GET /settings/resolved…` | Allowed or 403 — record which. Reading the mode leaks nothing sensitive; either is acceptable, but must match the UI | `[api]` |
| A6 | Menu visibility | User A: open Settings | Company Settings / Hierarchy Preference hidden or read-only, matching A3 | `[ui]` |
| A7 | Personal page permission 🔒 | Reporting mode; a user without `iam.personal.reporting_hierarchy` opens `/settings/personal/reporting-hierarchy` | "You don't have permission to change your reporting manager" / "Ask a tenant administrator…" | `[sec]` |
| A8 | Admin assign permission 🔒 | User A: `PATCH /iam/users/{B}/reporting-manager` | 403; B's manager unchanged | `[sec]` `[api]` |
| A9 | Session expired on the tab | Owner opens the tab, wait for the 5-minute access token to expire, switch mode | Silent refresh and save, or a clear sign-in prompt; never a half-saved state | `[func]` |

## Group B — Page rendering and defaults

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| B1 | Texts | Compare the tab with §2.3 | Every text as listed; no raw keys like `companySettings.hierarchy.*` | `[ui]` |
| B2 | Current mode shown | With `role` saved | Role-based card selected; "Your saved mode: Role-based"; preview highlights Role, dims Reporting | `[ui]` |
| B3 | Loading state | Throttle the network, open the tab | "Loading hierarchy preference…", then content; no flash of the wrong mode | `[ui]` |
| B4 | Live preview content | Open the info / preview | Role example and Reporting example as §2.3; note the contradiction (§2.3 note) | `[ui]` |
| B5 | Change history list | Read the list | Matches `GET /settings/history` (2 rows on 28 Sep 2026), newest first, local time. Record whether "who" is shown (possible bug: `changed_by` exists in the API but is not shown) | `[ui]` `[api]` |
| B6 | Tab inside Company Settings | Click each Company Settings tab and back | Tab state kept, URL changes, back button works | `[ui]` |
| B7 | Error on load | Block `GET /settings/resolved` | A clear error with retry, not an empty page or a wrong default | `[ui]` |

## Group C — Switching the mode `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| C1 | Cancel the switch | Click Reporting-based → dialog → Cancel | Dialog closes; `role` still selected; GET shows `role`, version unchanged; no history row | `[func]` |
| C2 | Escape / click outside | Same, close with Esc and with a click outside | Same as C1 | `[ui]` |
| C3 | Switch to Reporting | Reporting-based → "Switch mode" | Toast "Hierarchy preference updated"; card selected; "Your saved mode" updated; GET `reporting`, version +1; history row added | `[func]` `[api]` |
| C4 | Reload after switch | F5 | Reporting still selected | `[func]` |
| C5 | Personal page appears | In Reporting mode open Personal Settings | "Reporting Hierarchy" menu item and page available | `[func]` |
| C6 | Switch back to Role | Role-based → "Switch mode" | Toast; GET `role`, version +1; personal page URL now redirects to `/settings`. Zoho shows a popup listing "Reporting To" usages (Z2) | `[func]` |
| C7 | Click the active card | With `role` saved, click Role-based | No dialog, no PUT, no history row | `[func]` |
| C8 | Invalid value by API | `PUT` with `value_json` `"manager"`, `""`, `null`, `"ROLE"`, `123`, `["role"]` | 400 with a clear error; value and version unchanged | `[api]` `[data]` |
| C9 | Missing `expected_version` | PUT without it | Rejected (400/409), or accepted as last-write-wins — record it; a silent overwrite is a lost-update risk | `[api]` `[conc]` |
| C10 | Double click "Switch mode" | Double click fast | One PUT, version +1 only, one history row | `[conc]` |
| C11 | Existing managers kept | Switch role → reporting → role | A's and B's `reportingManagerId` unchanged after each switch ("Existing manager and role assignments still apply") | `[func]` |
| C12 | Save fails | Block the PUT (offline) | "Couldn't update hierarchy preference."; card goes back to the saved mode | `[ui]` |

## Group D — Save, concurrency, history, audit `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| D1 | History after switches | After C3 and C6 | Two new rows with old → new value and time; newest first | `[func]` |
| D2 | History shows who | Read the rows | The name of the admin who switched (`changed_by`). Missing name = possible bug, not a Zoho gap | `[ui]` |
| D3 | Two tabs, stale write | Owner in tab 1 and Second admin in tab 2 both open the tab; tab 2 switches; tab 1 switches without reload | Tab 1 gets "Hierarchy preference was changed elsewhere. Refresh and try again."; nothing overwritten | `[conc]` |
| D4 | After conflict, refresh | Refresh tab 1 | Shows tab 2's value; switching now works | `[conc]` |
| D5 | Stale version by API | PUT with `expected_version` one lower | Conflict error; value unchanged | `[api]` `[conc]` |
| D6 | Audit log | Open the audit log after C3 | One entry per switch, labelled with the setting name, actor, old / new value | `[func]` |
| D7 | History limit | `GET /settings/history?limit=1` and `limit=100` | Paging works; UI shows a sensible number of rows | `[api]` |

## Group E — Profile rank as the role hierarchy

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| E1 | Read the hierarchy | Settings → Security → Profiles (hierarchy view) | CRM Admin 700 → Manager 500 → Supervisor 300 → User / test / mahmoud 100; matches `GET /iam/profiles` | `[func]` `[ui]` |
| E2 | Parent options | Create `QA HP Profile`, open Parent | "Only profiles ranked higher than this one can be selected as parent." — only higher ranks offered | `[func]` |
| E3 | Rank must be below parent | Rank 500 under Supervisor (300) | Blocked with the rank hint | `[func]` `[data]` |
| E4 | Rank above own | As a non-owner admin, set a rank above your own | "Rank must be below {{actorMaxRank}} (your effective rank)." | `[sec]` |
| E5 | Rank conflict badge | (API) make a child's rank ≥ parent's if the API allows it | "Rank conflict" badge and repair text; record whether the API should have refused it | `[api]` |
| E6 | Delete a profile with users | Delete `QA HP Profile` after assigning a QA user | Message "…Any users currently assigned to it will lose this profile." Zoho asks where to move users (Z6) | `[func]` |
| E7 | Users with two profiles | User "CRM Admin, Desk Administrator" | Record which rank applies for CRM visibility (CRM profile only, or highest) | `[func]` |
| E8 | Rank change takes effect | Change a QA user's profile from User to Supervisor | Visibility in Role mode follows the new rank without re-login, or after re-login — record which | `[func]` |

## Group F — Reporting manager in the admin Users modal `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| F1 | Field shown | Owner → Users → open User B | "Reporting manager" select with B's current manager and the note text (§2.3) | `[ui]` |
| F2 | Options | Open the select | All users except B, plus "No manager (clear)". Compare the count with `GET /iam/users` (16) and the Users list (9) | `[func]` |
| F3 | Set a manager | Set B's manager to User A, Save | "Reporting manager set to {{manager}}."; GET shows `reportingManagerId` = A; A's `/iam/me/subordinates` contains B | `[func]` `[api]` |
| F4 | Clear | "No manager (clear)", Save | "Reporting manager cleared."; GET null | `[func]` |
| F5 | Loop of two | B → A, then A → B | Second save rejected ("loops in the chain are rejected"), clear message | `[func]` |
| F6 | Longer loop | A → B, B → Supervisor, Supervisor → A | Rejected | `[func]` |
| F7 | Self by API | `PATCH /iam/users/{A}/reporting-manager` with A's own id | 400 | `[api]` `[data]` |
| F8 | Bad ids by API | malformed UUID, unknown UUID, deleted user, other tenant's user, Desk-only user | 400 / 404 for each; nothing saved. Desk-only user: record whether allowed | `[api]` `[data]` `[sec]` |
| F9 | Lower rank as manager | Set the CRM Admin's manager to User A (rank 100) | TAVI allows it today; Zoho only allows a higher role (Z7) | `[func]` |
| F10 | Works in Role mode | With `role` saved, repeat F3 | Saves (section is not hidden in Role mode). Record it | `[func]` |
| F11 | Restore | Put A → `d23fb4e0`, B → `155208be` | GET matches the baseline | `[func]` |

## Group G — Reporting manager on the Personal Settings page `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| G1 | Hidden in Role mode | `role` saved; User A opens `/settings/personal/reporting-hierarchy` | Redirect to `/settings`; no menu item | `[func]` |
| G2 | Shown in Reporting mode | `reporting` saved; User A opens it | "Reporting Hierarchy" page, manager field shows A's current manager ID, "Your direct reports" | `[func]` `[ui]` |
| G3 | Direct reports | Set B → A (F3), User A reloads | B listed; with none: "You don't have any direct reports yet." | `[func]` |
| G4 | Save a valid manager ID | User A pastes the Supervisor's ID, "Save changes" | "Reporting manager updated"; GET `/iam/me/profile` shows it | `[func]` `[data]` |
| G5 | Empty = no manager | Clear the field, Save | Saved as null | `[func]` `[data]` |
| G6 | Self as manager | Paste A's own ID | "Couldn't update reporting manager." with a reason; nothing saved | `[data]` |
| G7 | Bad input | malformed, spaces around a valid ID, unknown, deleted user, another tenant's user, script text, 1,000 chars | Rejected with a clear message; valid ID with spaces is trimmed or rejected (record which); no script runs | `[data]` `[sec]` |
| G8 | Loop | B → A exists; User A sets manager = B | Rejected (loop) | `[func]` |
| G9 | Who may change it | Record whether a normal user is allowed to choose their own manager at all. Zoho: only an admin sets Reports To | Possible bug if any user can pick any manager | `[sec]` |
| G10 | Save button state | Open the page, change nothing | "Save changes" disabled until the value changes | `[ui]` |
| G11 | Restore | Put A back to `d23fb4e0` | GET matches the baseline | `[func]` |

## Group H — Record visibility per module

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| H1 | Read the values | Modules → each CRM module → permissions | Leads = Hierarchy, 7 others = Public; matches `GET /modules` | `[func]` |
| H2 | Options and hints | Open the radio | CRM: Public, Hierarchy with the §2.3 hints. Desk wording / Public Read Only absent in CRM (Z16) | `[ui]` |
| H3 | Change Contacts to Hierarchy `[serial]` | Owner sets Contacts → Hierarchy, Save | Saved; GET shows `hierarchy`; restore to `public` after group J | `[func]` |
| H4 | Admin sees all | Owner lists Leads | Sees every QA lead ("Admins see all.") | `[func]` |
| H5 | Unassigned records | Any user lists Leads | `QA HP Unassigned` visible to everyone ("Unassigned records are visible to everyone.") | `[func]` |
| H6 | Public module ignores the mode | In both modes User A lists Contacts (Public) | Sees B's QA contact in both modes | `[func]` |

## Group I — Visibility in Role mode `[serial]`

Preference `role`. Leads = Hierarchy. QA leads exist for A, B, Supervisor and unassigned. Each row checks the UI list **and** the API list, with the user's own lead as the control (§0.7).

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| I1 | Own records | User A lists Leads | Sees `QA HP A-own` (control) and `QA HP Unassigned` | `[func]` |
| I2 | Peer (same rank) | User A lists Leads | Does **not** see `QA HP B-own` (B is also rank 100). Zoho: peers do not see each other unless Share Data with Peers (Z5) | `[func]` |
| I3 | Superior, same department 🔒 | Supervisor lists Leads | Sees subordinates' leads in their department | `[func]` |
| I4 | Superior, other department 🔒 | Supervisor (org unit `60aeb9ce`) vs User A (HR) | Record what happens. Preview text: sees every lower rank in the tenant. Hierarchy hint: only in their department. Zoho: only their own branch (Z4). Any mismatch with TAVI's own texts = bug | `[func]` |
| I5 | Subordinate up | User A lists Leads | Does **not** see `QA HP Sup-own` | `[func]` |
| I6 | Reporting chain ignored | Set B → A as manager, still in Role mode; User A lists Leads | Does **not** see B's lead (rank decides, not the chain) | `[func]` |
| I7 | Open by direct URL | User A opens B's lead by URL / `GET /records/…/{id}` | 403 / not found, not the record | `[sec]` `[api]` |
| I8 | Search, reports, related lists | User A searches "QA HP", opens a Leads report, a related list | B's lead never appears anywhere | `[sec]` |

## Group J — Visibility in Reporting mode `[serial]`

Preference `reporting`. Same data. Set B → A as manager for this group; restore after.

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| J1 | Manager sees report | User A lists Leads | Sees `QA HP A-own` (control) and `QA HP B-own` | `[func]` |
| J2 | Report does not see manager | User B lists Leads | Sees own lead, not A's | `[func]` |
| J3 | Rank ignored | User A (rank 100) still sees B even though they are peers by rank | Chain decides, not rank | `[func]` |
| J4 | Indirect report 🔒 | Set A → Supervisor (chain Supervisor → A → B); Supervisor lists Leads | Sees A's and B's leads (whole chain below). Zoho: all levels below | `[func]` |
| J5 | Not in my chain | Supervisor with no reports (before J4) | Does not see A's or B's leads | `[func]` |
| J6 | Change takes effect | Clear B's manager while A's session is open; A reloads | B's lead disappears without re-login, or after re-login — record which | `[func]` |
| J7 | User with no manager | Clear B's manager | Record who sees B's records. Zoho lets the admin choose "Any user higher up in the hierarchy" or "Super admin and Administrators" (Z1) | `[func]` |
| J8 | Switch back | Switch to `role` with B → A still set | I2 behaviour returns: A no longer sees B's lead | `[func]` |
| J9 | Restore | Managers back to baseline; Contacts back to Public; preference `role` | GET diff clean | `[func]` |

## Group K — Where the hierarchy is used `[serial]`

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| K1 | Approval to "Manager" | Create `QA HP Approval` on Leads with approver "Manager"; B (manager A) submits | A receives the approval request | `[func]` |
| K2 | Approval to "submitter's manager" | Same with "submitter's manager" | Goes to the submitter's manager | `[func]` |
| K3 | No manager | Clear B's manager, submit again | A clear fallback (admin or a message), not a stuck request. Zoho: follows the "no manager" choice (Z1, Z15) | `[func]` |
| K4 | Mode does not change approvals | Repeat K1 in Role mode | Same approver (approvals use the manager field in both modes). Record it | `[func]` |
| K5 | Assignment rule "Reporting Manager" | Create `QA HP Rule` with criteria Reporting Manager = A; create a lead owned by B | Rule matches | `[func]` |
| K6 | Levels | Look for 2nd / 3rd level approvers | Not offered today (Z15) | `[func]` |
| K7 | Cleanup | Delete `QA HP Approval`, `QA HP Rule` and their records | Gone | `[func]` |

## Group L — Security, API, i18n / RTL, accessibility, performance, compatibility

| ID | Scenario | Steps | Expected | Tags |
|---|---|---|---|---|
| L1 | No token | Every §2.1 endpoint without `Authorization` | 401, no data | `[sec]` `[api]` |
| L2 | Type confusion | PUT body with `value_json` not a string, `expected_version` as text, extra keys, `scope_type: "User"` | 400; nothing saved; a User-scope value must not override the Org value for other users | `[sec]` `[api]` `[data]` |
| L3 | Wrong app key | Same calls with `x-app-key: desk` | Same tenant setting, or rejected — record which; no cross-app write | `[api]` |
| L4 | Other tenant | A user of another tenant reads / writes this tenant's setting and managers (swap `x-tenant-id`) | 403 / 404; nothing changed | `[sec]` |
| L5 | Enumerate users via manager field | User A pastes random UUIDs on the Personal page | The error does not reveal whether a user exists in another tenant | `[sec]` |
| L6 | XSS in names | A QA user named `QA HP <img src=x onerror=alert(1)>` shown in the manager select, direct reports, history | Shown as text | `[sec]` |
| L7 | Arabic / RTL | Switch the UI to Arabic | Tab, dialog, cards, preview and personal page translated and mirrored; no raw keys | `[i18n]` |
| L8 | Keyboard | Tab through the cards and dialog | Cards reachable and selectable with keyboard; dialog traps focus; Esc closes; visible focus | `[a11y]` |
| L9 | Screen reader | Read the cards with a screen reader | Role = radio, selected state announced | `[a11y]` |
| L10 | Mobile width | 400 px | Cards stack, dialog fits, no horizontal scroll | `[ui]` |
| L11 | List speed with Hierarchy | Leads list as User A in each mode, 5 runs | Response time similar to Public; no time-outs | `[perf]` |
| L12 | Browsers | Edge, Chrome, Firefox | Same behaviour | `[compat]` |

---

## E2E journeys `[serial]`

| ID | Journey | Steps | Expected |
|---|---|---|---|
| E2E-1 | Move a sales team to Reporting | Owner switches to Reporting → sets B → A in the Users modal → B creates a lead → A sees it → B does not see A's → switch back to Role → A no longer sees B's lead | Each step as in C, F, J, I. Ends on `role`, managers restored |
| E2E-2 | Self-service manager | Reporting mode → User A sets own manager to the Supervisor on the Personal page → Supervisor sees A's leads and A in their direct reports → A clears it | Matches G and J |
| E2E-3 | Approval through the chain | Reporting mode, B → A → Supervisor → B submits a lead for approval to "Manager" → A approves | Request reaches A; record whether a 2nd level is possible (Z15) |
| E2E-4 | Negative recovery | Two admins switch at once (D3) → one gets the conflict → refresh → set `role` → a loop is attempted (F5) and rejected → all restored | No lost update, no loop saved, final diff clean |

---

## Group Z — Gaps (run to confirm they are still missing or now built)

Each row: look for the capability in the UI and the API. **Still missing** = the item stays open. **Built** = run the expected behaviour and tell the user so the item can be closed. Evidence images: `evidence/0N-…-vs-zoho.png`.

| ID | Item | How to check | Expected (Zoho CRM) | Evidence |
|---|---|---|---|---|
| Z1 | Who manages records of users with no manager | Tab in Reporting mode | Second choice: "Any user higher up in the hierarchy" or "Super admin and Administrators" | 01 (docs only) |
| Z2 | Warning when switching back to Role | Switch reporting → role with a report / view using "Reporting To" | Popup listing each usage, keep or remove each | 01 (docs only) |
| Z3 | Role tree separate from profiles | Settings → Security; `GET /iam/roles` | Roles tree (CEO → Manager → …), each user has one role; profiles only hold permissions | 02 |
| Z4 | Superior sees only own branch | I4 | Superior sees records of roles below them in their branch only | 02 |
| Z5 | Share Data with Peers | Role / profile edit | Per-role option, off by default; peers see each other's records when on | 02 |
| Z6 | Transfer & Delete for roles | Delete a profile with users and children (E6) | Choose the role to move users and sub-roles to before delete | 02 |
| Z7 | Manager must hold a higher role | F9 | Only users in a superior role offered | 03 (docs only) |
| Z8 | User picker on the Personal page | G2 | Pick a user from a list (Zoho: admin sets Reports To in user details) | 03 |
| Z9 | Hierarchy view on the user and Reports To column | User details; Users list columns / filters | "Reporting Hierarchy" section with manager and direct reports; Reports To column and filter | 03 (docs only) |
| Z10 | Move reports when a manager is deleted / deactivated | Deactivate a QA manager with a QA report | Asks to move reports to another user or leave them with no manager | — |
| Z11 | Check reports when a manager's role changes | Demote a QA manager below their report | "Change of Reporting manager" prompt | — |
| Z12 | "Reporting To" in reports, criteria, filters, merge fields | Report builder, custom view criteria, list filters, email template merge fields | "Reporting To" available in each (Reporting mode) | — |
| Z13 | Workflow email to owner's manager | Workflow → email alert recipients | "Record Owner's Manager" / subordinates; merge field `${!Module.Owner.Reporting_To}` | — |
| Z14 | Blueprint owner "Reporting Manager" | Blueprint transition owners | "Reporting Manager" offered | — |
| Z15 | Approval levels | Approval process approvers (K6) | 1st / 2nd / 3rd level, or all up to level 2 / 3; fallback for no manager follows Z1 | — |
| Z16 | Default access options | Module record visibility (H2) | Private, Public Read Only, Public Read/Write, Public Read/Write/Delete | 04 |
| Z17 | Sharing rules | Settings; `GET /iam/sharing-rules` | Owner-based and criteria-based rules, from / to role, role + subordinates, group; "Superiors Allowed" | 04 |
| Z18 | Roles API | `GET /iam/roles`, `/iam/hierarchy` | List / create / update / delete roles with `reporting_to`, `share_with_peers`, delete with `transfer_to_id` | — |
| Z19 | Read any user's subordinates | `GET /iam/users/{id}/subordinates` | Admin can read any user's reports (today only `/iam/me/subordinates`) | — |

---

## Traceability

No PRD exists, so each source below stands in for requirements.

| Source | Requirement | Scenarios |
|---|---|---|
| Tab texts (§2.3) | Two modes, confirm, success / error / conflict, denied text | A1–A3, B1–B4, C1–C12, D3–D5 |
| Tab texts | "Existing manager and role assignments still apply" | C11 |
| Preview text | Role: "By profile rank"; Reporting: "By reporting-manager chain", Sara / Omar / Lina example | I1–I8, J1–J8 |
| Hierarchy hint | Own + lower-ranked in department; unassigned visible; admins see all | H4, H5, I3, I4 |
| Admin modal note | Manager used by approvals; replace existing; loops rejected | F3–F8, K1–K4 |
| Personal page texts | Paste ID or empty; direct reports; denied text; only in Reporting mode | G1–G11, A7 |
| Profile form texts | Parent must rank higher; rank below parent and below actor | E2–E5 |
| Permissions | `iam.company.hierarchy_preference(.manage)`, `iam.personal.reporting_hierarchy`, `iam.user.reporting_manager.assign` | A3–A8 |
| Settings contract | Versioned PUT, history, audit | C8–C10, D1–D7, L2 |
| Zoho CRM (inventory) | Role vs Reporting behaviour, peers, branch rule, no-manager fallback, consumers, data sharing, API | I, J, K, Z1–Z19 |
| Missing list | 19 gaps | Z1–Z19 |
| Possible bugs (missing list) | texts disagree; self-assign by ID; section in Role mode; history without "who"; 9 vs 16 users | B4 / I4, G9, F10, D2, F2 |

Every on-screen promise and every gap has at least one scenario.

---

## Reporting

- **Report:** `executions/<date>_crm-hierarchy-preference/report.md` and an HTML version with:
  - one line per row: ID, verdict, one-sentence result;
  - the Allure / extent report from the automation run (feature `crmhierarchy`);
  - a list of new bugs (house style, one Plane item per bug, **only after the user agrees**).
- **Evidence:**
  - Screenshots for **failed rows only**, side by side against live Zoho, in `screenshots/annotated/<id>-vs-zoho.png`. Where Zoho has no such behaviour (change history, preview), use a TAVI-only image and say "Not comparable".
  - Redact tokens and cookies; report token **lengths** only. Never print credentials.
- **API evidence:** method, path, status code, error code and the shape of the body.
- **Coverage gaps:** restate the §1.4 blockers that left rows Inconclusive and the "Not yet confirmed" list with what the run learned. Above all, state plainly whether switching the mode changed what users see.
- **Revert proof:** a final GET of the preference (`role`), every user's `reportingManagerId`, every module's `recordVisibility`, every CRM profile's rank / parent, and the QA record searches, diffed against the §1.3 baseline. Only the `version` number and the new history / audit rows may differ. Any other difference is listed and explained.
- **Group Z:** a short table "still missing / now built" per item, so the gap ticket can be updated in one go.
