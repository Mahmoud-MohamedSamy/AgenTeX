# Defects — CVS-A03 / CVS-A04 rerun (2026-10-05)

## 1. A User-profile user (no Manage Shared Views) can create public views through the API (POST 201, visible to everyone under Public views)

- **Severity:** High
- **Case:** CVS-A03 — The API refuses a public view from a user without Manage Shared Views

**Steps to reproduce**
1. Sign in as a User-profile user (no Manage Shared Views).
2. POST /api/v1/modules/{Leads}/views with {"kind":"list","name":"QA CV api-public","visibility":"everyone"}.
3. GET /api/v1/modules/{Leads}/views?kind=list as that user.
4. As the Owner, open the Leads view picker and look under Public views.

**Expected:** The POST is refused with 403 or 422; no "QA CV api-public" in either listing; nothing new under Public views.

**Actual:** As test user 1 (User profile, no Manage Shared Views): POST /api/v1/modules/{Leads}/views {kind:list, name:QA CV api-public, visibility:everyone} -> 201; the same with a complete body -> 201. Both stored as public: listed in test user 1 GET and in the Owner GET; the Owner picker shows both under PUBLIC VIEWS. Expected 403/422 and nothing new under Public views. Both views deleted and purged by the Owner afterwards.

**Evidence:** [a03-a04-105012-9ff8-A03-owner-picker-search.png](./screenshots/a03-a04-105012-9ff8-A03-owner-picker-search.png), [a03-a04-105012-9ff8-A03-vs-zoho.png](./screenshots/a03-a04-105012-9ff8-A03-vs-zoho.png), [a03-a04-105012-9ff8-a03-a04.json](./screenshots/a03-a04-105012-9ff8-a03-a04.json)

## 2. A user a view is shared with can edit and delete it (can_edit/can_delete true, PATCH 200, DELETE 204); the deleted view bypasses the Recycle Bin

- **Severity:** High
- **Case:** CVS-A04 — A user a view is shared with cannot edit or delete it in the UI or the API

**Steps to reproduce**
1. As the Owner, create a list view "QA CV shared" on Leads and share it with a User-profile user only.
2. As that user, GET /api/v1/modules/{Leads}/views/{id} and read can_edit / can_delete.
3. As that user, open /modules/{Leads}/views/{id}/edit.
4. As that user, PATCH the view with {"name":"QA CV hijacked"}.
5. As that user, DELETE the view.
6. As the Owner, GET the view and check the Recycle Bin.

**Expected:** can_edit=false and can_delete=false; the editor shows "You cannot edit this view — Only its owner, or someone who can manage shared views, can change it."; PATCH and DELETE are refused; the view is unchanged for the Owner.

**Actual:** Owner created QA CV shared (visibility selected, shared with test user 1 only). As test user 1: GET -> can_edit=true, can_delete=true; /views/{id}/edit opens with Save enabled and no You cannot edit this view message; PATCH {name:QA CV hijacked} -> 200 (renamed); DELETE -> 204; the Owner then gets 404. The deleted view is in neither the Owner nor the user Recycle Bin, so it cannot be restored.

**Evidence:** [a03-a04-105012-9ff8-A04-user-editor.png](./screenshots/a03-a04-105012-9ff8-A04-user-editor.png), [a03-a04-105012-9ff8-A04-vs-zoho.png](./screenshots/a03-a04-105012-9ff8-A04-vs-zoho.png), [a03-a04-105012-9ff8-a03-a04.json](./screenshots/a03-a04-105012-9ff8-a03-a04.json)

