# Test report — CVS-A03 / CVS-A04 rerun with a User-profile account

**Run summary (JSON):** [run-summary.json](./run-summary.json) · **Defects:** [bugs/bug-list.md](./bugs/bug-list.md)

| | |
|---|---|
| Target | TAVI CRM — https://crm.taviportal.com, tenant NDC-Staging |
| Why rerun | Both cases were Inconclusive in run execu_2026-10-04_17-47-37: no User-profile login was available. The login for "test user 1" (profile: User) was found in docs/Credentials/Microsoft Edge Passwords.csv. |
| Users | Owner (Tenant Owner); test user 1 (system profile "User", no Manage Shared Views) |
| Started | 2026-10-05T07:50:12Z |
| Ended | 2026-10-05T07:52:00.000Z |

## Result

**0 passed, 2 failed** (both High).

| Case | Result | Defect | Comparison |
|---|---|---|---|
| CVS-A03 | **Fail** (High) | A User-profile user (no Manage Shared Views) can create public views through the API (POST 201, visible to everyone under Public views) | [image](./bugs/screenshots/a03-a04-105012-9ff8-A03-vs-zoho.png) |
| CVS-A04 | **Fail** (High) | A user a view is shared with can edit and delete it (can_edit/can_delete true, PATCH 200, DELETE 204); the deleted view bypasses the Recycle Bin | [image](./bugs/screenshots/a03-a04-105012-9ff8-A04-vs-zoho.png) |

## Notes

- Zoho was not compared: it needs a lower-profile Zoho user, which is not available.
- The A04 shared view was created through the API by the Owner (visibility "selected", shared with test user 1 only).

## Test data and cleanup

| Item | Result |
|---|---|
| 2 × "QA CV api-public" (created by test user 1) | Deleted by the Owner and purged from the Recycle Bin |
| "QA CV shared" (renamed "QA CV hijacked" by test user 1) | Deleted by test user 1 in step 4; not in either Recycle Bin |
| Live views named QA CV api-public / shared / hijacked | None left (checked as the Owner) |

---
## Correction (6 Oct 2026)
The Fail verdicts for **CVS-A03** and **CVS-A04** in this run are **withdrawn**. They were run with test user 1, which has the *Manage Shared Views* permission, so the account did not meet the cases' precondition (a user without that permission). Both cases were re-run in **execu_2026-10-05_11-20-40** with test user 2 (no Manage Shared Views) and **passed**. See that run's report and the "Combined Status" sheet.
