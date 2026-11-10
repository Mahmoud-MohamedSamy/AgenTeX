# Shared-state tests, 10 Nov 2026 (NDC-Staging, ndc-staging-owner + Mahmoud Samy as viewer)

| Ticket / item | Verdict | What was seen |
|---|---|---|
| NDC-2828 (Users API fixed 200 rows) | **Fixed** | Tenant now has 201 users (122 active + 79 invited). Plain GET /iam/users returns all 201; meta present (total_count 201, pages, next_cursor); page/pageSize/offset/cursor/search all work. No standalone invite needed. |
| NDC-2392 item 8 (integrated user inactive → re-point) | Not checked (would break the shared integration) | Status API no longer exposes the integrated user; integration texts have no inactive / re-point wording (only Disconnect/reconnect). No way to switch the integrated user to a QA user without disconnecting the live integration. Likely still missing. |
| NDC-2417 item 4 (superior sees own branch) | Not working as tested | Viewer Mahmoud Samy (CRM "User", rank 100, OU Sales), Leads visibility = Hierarchy. Leads owned by rank-10 QA users in Sales (same unit) and Sales/Team 2 (sub-unit) → 403, same as HR (sibling) → 403; list search finds none. Caveat: the owners were invited (not yet activated) QA users; raising a real user's profile was blocked, so no active lower-rank owners were available. |
| NDC-2417 item 15 (Levels approver) | Partly built | Process with approver "Levels", depth 2; chain Samy → QA SS C → QA SS B. Samy's lead went to QA SS B only (the 2nd manager up, one level, mode anyone). No "everyone up to level N" option. Submitter with no manager → request went to the process admin (fallback works, per the "process admins are the fallback" text). |
| NDC-2417 item 16 (Public Read Only) | Still missing in CRM | CRM record visibility accepts only public / hierarchy: PUT /modules/{leads}/record-visibility {mode:public_read_only} → 400 INVALID_RECORD_VISIBILITY "Expected one of 'public', 'hierarchy'". The CRM permission modal offers only those two; Public Read Only exists only for Desk. |

Settings changed and restored (all verified):
- Mahmoud Samy reporting manager: none → QA SS C → none.
- Leads record visibility: change refused (stays hierarchy).
- Mahmoud Samy CRM profile User → Supervisor: blocked by the permission check; not changed.

Data created and removed: 6 invited QA users (QA SS A–F, mmohamed+qass-*@anyware.software) cancelled; 9 leads deleted + purged; 1 approval process (QA SS 2417 Levels) deleted; 2 pending approvals rejected by owner takeover first. Verified: leads/process 404, bin clear, users back to 201, no QA SS users.
Emails: 6 invitation emails to mmohamed+qass-a…f@anyware.software (approved mailbox); possible approval notifications to the invited QA addresses.
