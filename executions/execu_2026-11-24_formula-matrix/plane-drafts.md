# Plane drafts — formula matrix test run, 24 Nov 2026 (not posted)

## 1. Comment on NDC-3221 (state stays Bug)

Retest / extra types — 24 Nov 2026
Environment: staging-crm.taviportal.com, NDC-Staging, owner; module QA FX Matrix (formula matrix: 19 functions × 34 field types)
Method: API values + record page (both layouts)

Still failing for the types in this ticket (multi-select, multi-select lookup, address, location): every function reads them as empty.

The same happens for four more field types, not listed in the ticket yet:

| Field type | Value on the record | concat("[", X, "]") | len(X) | isblank(X) | text(X) |
|---|---|---|---|---|---|
| Map | 30.04, 31.23 | [] | 0 | true | (empty) |
| File Upload | qa-fx-matrix.txt | [] | 0 | true | (empty) |
| Image Upload | qa-fx-matrix.png | [] | 0 | true | (empty) |
| Camera | 1 photo (qa-fx-camera.png) | [] | 0 | true | (empty) |

Note: count(Camera) gives 1 while isblank(Camera) gives true on the same record.
Expected: a readable value (map coordinates, file name), or the formula builder refuses these field types.
Record: QA FX Matrix - all filled (4c282ba0-8ed7-406a-841d-4e30e72c21f9).
Evidence: NDC-3221-extra-types.png

## 2. New bug — Formula field | Formulas treat a User field as empty when it was filled in by its default value

Module: CRM · Priority: Medium · State: Bug · Cycle: Sprint 17 · Assignee: none

Summary
When a record is created without choosing a user, the User field is filled in automatically with the signed-in user, but every formula that reads that field calculates as if the field were empty.

Steps to reproduce
1. In a module, add a User field (In User) and formula fields that read it, e.g. if(isblank(in_user), "empty", "set"), isblank(in_user), len(in_user).
2. Open Create record. In User is already filled with the signed-in user (ndc-staging-owner).
3. Save without changing In User (same through the API: create a record without in_user).
4. Open the record.

Expected result
The formulas use the user that is saved on the record: "set", isblank = false, len > 0.

Actual result
In User shows ndc-staging-owner, but the formulas give "empty", isblank = true, len = 0, concat = "[]".
When the user is chosen by hand, the same formulas are correct (isblank = false).

Environment
TAVI CRM web (staging-crm.taviportal.com), org NDC-Staging, owner account; module QA FX Matrix; Edge on Windows 10; 24 Nov 2026
Record: QA FX Matrix 2 - all empty (27bc7599-8702-467a-a2b6-b4686350053d)

Evidence
NDC-new-user-default-formula-empty.png (create form with In User pre-filled + the record's formula values)

## 3. Pipeline field type — recommend NOT filing

What I saw: GET /fields/datatypes lists "pipeline" among the 36 types, and creating a custom field with it returns
400 DATATYPE_KEY_UNKNOWN "Datatype key 'pipeline' is not a recognized datatype".
Why not a bug: the app marks Pipeline as a system-only type (one per layout, used by Deals); the layout builder does not offer it for custom fields. Only the error text is misleading ("not recognized" instead of "system-only, cannot be added").
If you still want it: Low — "Fields | Creating a Pipeline field returns 'not a recognized datatype' instead of saying it is system-only".
