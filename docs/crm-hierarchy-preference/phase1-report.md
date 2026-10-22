# CRM Hierarchy Preference — Phase 1 report

Date: 21 Oct 2026 · TAVI CRM staging (`staging-crm.taviportal.com`, tenant NDC-Staging) vs Zoho CRM org943261092 (read-only)
Scope: Company Settings → Hierarchy Preference (Role-based / Reporting-based), plus the Roles tree, the user's Reports To field and record visibility.
Status: **Phase 1 (gap list) done, waiting for review.** Phases 2 (Plane ticket + spec) and 3 (automation + run) not started.

## What was done

1. **Looked for a PRD in Plane (NDC).** I searched for hierarchy, reporting manager, reports to, roles and data sharing. No CRM PRD exists. Related Desk items: NDC-2300 (Share data with peers has no effect), NDC-2299, NDC-2301.
2. **Mapped what TAVI ships:**
   - Scanned 350 front-end bundle files and the locale files for pages, API calls, permissions and UI texts.
   - Called the live API as owner. Saved the baseline: setting = `role`, version 2, plus profiles, org units, users and reporting managers.
   - Probed routes that might exist. Nine return 404 (roles, hierarchy, data sharing, sharing rules, other users' subordinates).
   - Took screenshots of the Hierarchy Preference tab, the switch dialog (cancelled), Profiles, Org Units, Users and the user edit window.
3. **Researched Zoho CRM:**
   - A background agent listed about 130 behaviours from Zoho's help and API docs, each with a link.
   - I captured the live Zoho screens for Hierarchy Preference, Roles and Data Sharing (read-only).
4. **Built the gap list:** 19 gaps in 5 groups, plus not-gaps, items that could not be checked and possible bugs.
5. **Built 4 side-by-side evidence images**, TAVI vs Zoho.
6. **Saved project memory** for this feature.

**Nothing was changed** on TAVI or Zoho. The TAVI switch dialog was opened and cancelled, and the setting is still `role`, version 2.

## What TAVI has today

- **Tab:** two cards (Role-based, Reporting-based), a confirm dialog, a "changed elsewhere" (version conflict) message, Change history and a Live preview. Zoho has none of these extras.
- **Role-based** uses profile rank: CRM Admin 700 → Manager 500 → Supervisor 300 → User 100. There is no separate role object.
- **Reporting manager** can be set in two places:
  - Admin: Users → edit user → dropdown.
  - Self: a Personal Settings page that only appears in Reporting mode. It needs a pasted user ID.
- **Record visibility** is set per module, Public or Hierarchy. Only Leads uses Hierarchy today.
- **Also used by:** approvals ("Manager", "submitter's manager") and assignment-rule criteria ("Reporting Manager").

## Gaps found (19)

**Settings page**
1. No option for who manages the records of users with no manager.
2. Switching back to Role gives no warning about where "Reporting To" is used.

**Role hierarchy**

3. No role tree; profile rank is used instead.
4. A superior should see only their own branch. TAVI's two help texts disagree with each other and with Zoho.
5. No "Share Data with Peers".
6. No "move users, then delete" step for roles (to confirm in Phase 3).

**Reporting hierarchy**

7. Any user can be chosen as manager. Zoho only allows users in a higher role.
8. The Personal page needs a pasted user ID instead of a user picker.
9. No manager / direct-reports view on the user, and no "Reports To" column.
10. Deleting or deactivating a manager doesn't ask what happens to their reports (to confirm).
11. Changing a manager's role doesn't check their reports.

**Where it's used**

12. "Reporting To" is missing in reports, view criteria, filters and merge fields.
13. No workflow email to the record owner's manager.
14. No "Reporting Manager" owner in blueprints.
15. No approval levels up the hierarchy (to confirm).

**Data sharing**

16. Only Public or Hierarchy per module. Zoho has Private, Read Only, Read/Write and Read/Write/Delete.
17. No sharing rules.

**API**

18. No roles API.
19. You can only read your own subordinates.

## Possible bugs (to check separately)

- The Live preview text ("every User in the tenant") and the Hierarchy visibility hint ("lower-ranked users in their department") disagree.
- A user can set their own manager by pasting any ID (self, a deleted user, another tenant, a loop).
- The reporting manager section works in Role mode, but the self-service page disappears.
- Change history doesn't show who made the change, though `changed_by` is in the API.
- The Users list shows 9 users while the API returns 16.

## Could not be checked yet

- **Whether switching the mode really changes who sees which records.** This needs a mode switch and a second user signed in (Phase 3).
- **Zoho's Reporting-mode screens** (items 1, 2, 7, 9). They need Zoho switched to Reporting Hierarchy and back. Waiting for approval; these items are backed by Zoho docs for now.
- **Items 6, 10, 11 and 15.** They need write actions on QA data.

## Files

| File | What it is |
|---|---|
| `crm-hierarchy-preference-missing-list.md` | Full gap list with sources |
| `evidence/01-preference-page-vs-zoho.png` | Settings page, TAVI vs Zoho |
| `evidence/02-role-tree-vs-zoho.png` | Profiles/rank vs Zoho Roles |
| `evidence/03-reporting-manager-vs-zoho.png` | Reporting manager, TAVI vs Zoho |
| `evidence/04-data-sharing-vs-zoho.png` | Record visibility vs Zoho Data Sharing |
| `evidence/originals/` | Raw screenshots from both sides |
| `reference/zoho-docs-inventory.md` | About 130 Zoho behaviours with links |
| `reference/tavi-baseline-2026-10-21.json` | Baseline for restoring after Phase 3 |
| `tools/make-evidence.js`, `evidence/configs/*.json` | Builds the evidence images |

## Next steps (after your review)

- **Phase 2:**
  - File one Plane gap ticket. I'll ask for assignee, state, priority, module and sprint first.
  - Write the spec (md + html).
- **Phase 3:**
  - Build the Selenium feature `crmhierarchy` and run it.
  - Switch the mode with two users to test visibility.
  - Set everything back and prove it with a diff against the baseline.
  - Write the HTML report with evidence for failed cases.
- **Decisions needed from you:**
  - Approve the gap list.
  - OK to switch Zoho to Reporting Hierarchy and back.
  - OK to use valafo4080 and nameb56175 as the second users.
