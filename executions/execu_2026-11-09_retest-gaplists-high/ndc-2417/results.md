# NDC-2417 — CRM Hierarchy Preference missing list: recheck 9 Nov 2026

**Tenant: NDC-Staging** (tenant id `a7a7a7a7-0000-0000-0000-000000000004`), staging-crm.taviportal.com, account ndc-staging-owner (Owner), signed in once (own session file). The October intake also ran on NDC-Staging.
Hierarchy preference today: **role**, version 36 (read only; last changes 27 Oct, reporting → role). Nothing was switched or changed.

How checked: live API (owner), the app's own text files (`/locales/en/iam.json`, `crm-approvals`, `crm-workflow`, `crm-blueprint`, `crm-modules`), the current CRM code bundle, and screenshots. Zoho side = October captures in `docs/crm-hierarchy-preference/evidence/originals/` (Zoho stays read-only).

Verdicts: **Built** · **Partly built** · **Still missing** · **Not checked** (why).

| # | Item (Plane numbering) | Zoho | TAVI now (9 Nov) | Verdict | Evidence |
|---|---|---|---|---|---|
| 1 | Who manages records of users with no manager (Reporting mode) | "Any user higher up" / "Super admin and Administrators" | No such option on the page or in the text files; the page has only the two mode cards | Still missing | ev-01 |
| 2 | Warning when switching back to Role, listing where "Reporting To" is used | Popup with keep/remove per use | Same generic "Switch hierarchy mode?" text both ways (`confirmBody`) | Still missing | ev-01 |
| 3 | Roles tree separate from profiles | Roles (CEO → …) separate from profiles | Still profile rank; `/iam/roles`, `/iam/hierarchy`, `/settings/roles` = 404 | Still missing | ev-03 |
| 4 | Superior sees only own branch | Branch of the role tree | Texts now agree and are branch-like: "Higher-ranked profiles see the records of lower-ranked profiles in the same org unit and the units below it"; preview "A Manager in Sales sees the Users of Sales and its sub-units, but not HR". Branch = org-unit subtree, not a role tree. Runtime not re-run (NDC-2412 is Done) | Partly built | ev-01 |
| 5 | Share Data with Peers | Per role, off by default | No text or setting anywhere in CRM | Still missing | ev-03 |
| 6 | Transfer & Delete a role | Move users/sub-roles first | Profile delete still says "Any users currently assigned to it will lose this profile" — no transfer step | Still missing | ev-03 |
| 7 | Only a higher role can be manager | Superior roles only | Admin dropdown = every user except self (code: `users.filter(u => u.userId !== self)`); no rank filter | Still missing | ev-02 |
| 8 | User picker on Personal Settings | Picked from a list | Still "Reporting manager (user ID) — Paste a user ID, or leave empty for no manager" | Still missing | ev-03 |
| 9 | Reporting Hierarchy section on user details + Reports To column/filter | Section with manager and reports | User window has only the manager select; Users list has no Reports To column/filter | Still missing | ev-02 |
| 10 | Deleting/deactivating a manager asks where reports go | Move subordinates prompt | Delete/Suspend texts have no subordinate step | Still missing | ev-03 |
| 11 | Role change that breaks the chain asks to change manager | "Change of Reporting manager" | No such text or check | Still missing | ev-03 |
| 12 | "Reporting To" in reports, views, filters, merge fields | Available in Reporting mode | Only the user field "Reporting Manager" in user criteria (assignment rules); nothing in records/views/filters text | Still missing | ev-03 |
| 13 | Workflow email to the record owner's manager / subordinates | `${Owner.Reporting_To}` | CRM workflow email recipients: Users, Org Units, Roles, Profiles, User fields, Teams, "Roles and subordinates". No "owner's manager" | Still missing | ev-03 |
| 14 | Blueprint transition owner "Reporting Manager" | Available | Transition owners: chosen users / "Allow record owner"; no Reporting Manager | Still missing | ev-03 |
| 15 | Approval levels up the hierarchy + fallback with no manager | 1st/2nd/3rd level, or all up to 2nd/3rd; fallback per item 1 | NEW: approver type **"Levels"** with "Reporting depth — How many levels up the reporting chain to ask", plus Manager and "Assign to the submitter's manager". Not run; the "all up to level N" choice and the no-manager fallback are not visible in the text | Partly built | ev-03 |
| 16 | Default access: Private / Public Read Only / Public Read/Write / Read/Write/Delete | 4 levels | NEW: CRM record visibility = **Public, Public Read Only, Hierarchy** (Desk names them Read/Write/Delete, Read Only, Private). No separate Read/Write vs Read/Write/Delete | Partly built | ev-03 |
| 17 | Sharing rules | Owner/criteria based | `/iam/sharing-rules`, `/settings/data-sharing` = 404; no page | Still missing | ev-03 |
| 18 | Roles API | `/settings/roles` CRUD | `/iam/roles`, `/settings/roles` = 404 | Still missing | ev-03 |
| 19 | Read any user's subordinates | — | `/iam/users/{id}/subordinates` = 404; only `/iam/me/subordinates` | Still missing | ev-03 |

Related bugs NDC-2412..2416: all **Done** in Plane (read only).

**Counts (19):** Built 0 · Partly built 3 (4, 15, 16) · Still missing 16 (1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19) · Not checked 0.
Not re-run at runtime (needs a mode switch or profile swaps, i.e. shared-state changes): whether the new org-unit branch rule (4), the Levels approver (15) and Public Read Only (16) behave as their text says.

**Writes:** none. **Evidence:** evidence/annotated/ev-01-preference-page-vs-zoho.png, ev-02-reporting-manager-vs-zoho.png, ev-03-roles-sharing-usage-vs-zoho.png.
