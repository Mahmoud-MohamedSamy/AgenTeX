---
name: crm-global-sets-intake
description: "CRM Global Sets vs Zoho CRM, 11 Nov 2026: PRD NDC-2806, gap ticket NDC-2870, 8 bugs filed (NDC-2865..2869, 2917..2919), 3 test rounds, reports, API how-tos and traps"
metadata:
  node_type: memory
  type: project
  originSessionId: ee5ce062-762e-4ac6-9542-9a3078b2187e
  modified: 2026-11-11T15:36:30.775Z
---

All done on 11 Nov 2026 using the new-feature-testing skill. Steps: plan → missing list → spec → three test rounds on NDC-Staging, with Zoho checked live → everything filed in Plane → reports → committed and pushed to main (65a7f62, b22a2f8).

**Plane (all filed 11 Nov)**
- Settings used for every item:
  - assignees Mahmoud Mohamed, Hegazy, Eslam;
  - label Modules & Fields, module CRM, Sprint 15;
  - bugs in state Bug, the gap ticket in Backlog;
  - priority by severity.
- PRD: **NDC-2806** "CRM Global Sets" (scope S1–S8). Comments on it link everything below.
- Gap ticket: **NDC-2870**, 11 gaps, with images G1–G3 attached.
- Bugs, each with an image attached:
  - **NDC-2865** (High): a new pick list field set to "Use a global set" can't be saved — 400 DATATYPE_OPTION_UNKNOWN.
  - **NDC-2866** (High): Replace leaves workflow criteria and field updates on the old value; the rule then writes the unused value.
  - **NDC-2867** (Medium): Replace is refused when a custom view filters on the value.
  - **NDC-2868** (Low): a PUT without row_version overwrites the set.
  - **NDC-2869** (Low): two editor labels are not translated in Arabic.
  - **NDC-2917** (High): Replace doesn't update reports — the filter keeps the old value and results go stale.
  - **NDC-2918** (High): Replace doesn't update field dependency maps.
  - **NDC-2919** (Low): removing a value used by an inactive blueprint breaks the blueprint.
- **NDC-2923** (multi-select can use a set) was filed and then deleted. The user said this is a TAVI plus — see [[tavi-extras-not-bugs]].

**Files**
- `docs/crm-global-sets/`:
  - missing list (Z1–Z11);
  - spec (groups A–L, E2E, Z, traceability);
  - `plane-draft/description-final.html` (the text filed as NDC-2870);
  - `reference/zoho-live-findings.md` and `zoho-docs-inventory.md`.
- `executions/execu_2026-11-11_crm-global-sets/`:
  - results.tsv (119 rows: 77 pass, 13 fail, 6 gap, 21 info, 2 not run — A5 no-access screen, I7 popup);
  - ledger.md and ledger-zoho.md;
  - evidence/annotated (B1–B8, G1–G3);
  - scripts/:
    - run.sh and common.js — TAVI API as a named account;
    - apicard.js and annotate-vs-zoho.js;
    - make-report.js and make-full-report.js;
    - plane-attach.js.
- Reports (private artifacts):
  - summary https://claude.ai/artifact/4H931cyXHux6m52VbxCboD
  - full https://claude.ai/artifact/NAQtDvFXTZoNeVBEJmEBw7

**What works in TAVI:**
- Create, edit and rename; Unused values and restore (50 at a time).
- Replace when only records use the value.
- Clone, Convert, Associate/Disassociate; deleting a set keeps its values on the fields.
- The more-than-15-fields rule.
- Permissions: view-only and none.
- Audit, import validation, mass update.
- An active blueprint blocks Replace/Remove.
- Dependency maps accept a set field as parent or child.
- TAVI extras: multi-select and radio fields can use a set; the name limit is 100 characters.

**Zoho seen live** (test org org944965048, Enterprise trial to 17 Nov, read+write allowed — see [[zoho-reference-capture]]):
- Ships the sets Source, Industry, and Countries and States (used by address fields).
- Replace updates records, view criteria, field updates, report filters (→ "IS Silver") and map dependency (Gold's children merged into the new value).
- Multi-select can't use a set.
- The replace API returns 500 — use the screen with the keyboard (type in the "from" box).

**API how-tos and traps (TAVI)**
- `/global-sets`: `values/replace {replacements:{Old:'New'}}`, `associate {module_id, field_id, mappings:{Local:'SetValue'}}`, `/from-field`, `/used-in`.
- POST fields refuses global_set_id. Link a field with associate instead.
- Workflow on/off: `POST /workflow/rules/{id}/activate|deactivate`. A partial-criteria PATCH wipes the criteria.
- Blueprint switch-on: PUT `{isActive:true, definition}`.
- Reports: `POST /reporting/reports {query_spec:{ir_version:14, filters:[{dataset_id, field_key, operator, value}]}}`. Delete needs `?expected_revision`.
- Dependency maps: `/modules/{id}/dependency-maps {controllingFieldId, dependentFieldId, valueMap}`.
- Profile permission: POST `/iam/profiles/{id}/permissions {permission_key, effect:'GRANT'}`; remove with `DELETE …/permissions/{key}`.
- Multi-select record value: `{kind:'array', items:[{kind:'string', value}]}`.
- Low-privilege account: "Mahmoud Samy" (CRM User). Test User 1 has no CRM access.

**Zoho traps**
- Map dependency: `POST /crm/v8/settings/layouts/{id}/map_dependency`.
- Reports have no create/delete API. Delete them in the UI and purge them from Recently Deleted before deleting the field they use.

**State left behind**
- All QA GS1111 data is deleted on TAVI and in Zoho, and the User profile was restored.
- Deleted QA records and fields are still in the TAVI Recycle Bin (the purge was refused by the permission check).
- The "Colors" set (TAVI and Zoho) isn't ours.

**Why:** retests of these tickets and any follow-up on NDC-2806 reuse these ids, scripts and findings.

**How to apply:**
- Retest with the run.sh scripts and the same QA prefix.
- Compare with Zoho only while the trial lasts (to 17 Nov).
- Don't re-file the multi-select item.

Related: [[annotate-evidence-vs-zoho]], [[plane-attach-via-api-key]], [[retest-r15-progress]].
