---
name: desk-modules-fields-intake
description: "TAVI Desk Modules/Tabs/Fields vs Zoho Desk: spec/missing list/bug report paths, runs 1–2 (5–7 Oct 2026) results, API how-tos and traps"
metadata:
  node_type: memory
  type: project
  originSessionId: f1cf398a-8f08-4c25-94f7-f92da3730424
  modified: 2026-10-07T14:37:17.532Z
---

Intake 5 Oct 2026; Time Entry skipped "for now".
- Files: `docs/desk-modules-fields/spec-desk-modules-fields.md` (206 rows), `desk-modules-fields-missing-list.md` (13 gaps; item 13 default values added to NDC-2174 on 13 Oct), `evidence/` (13 annotated gap images), `bug-report-data.js` (source, ticket form: summary/steps/expected/actual/request/response/evidence/env) → `make-bug-report-md.js` → `make-bug-report-html.js` (45 bugs; MF-44 removed as false positive).
- Plane: missing list **NDC-2174** (12 gaps + images 7 Oct; item 13 + image 13 Oct). Bugs filed 12 Oct 2026 as **NDC-2219…NDC-2262** (44; label Modules & Fields, module Desk, state Bug, assignees Mahmoud + Hegazy); MF-13 = NDC-1864. Map MF→NDC in `docs/desk-modules-fields/plane-map.json`; evidence copies `bug-evidence/NDC-xxxx-{annotated,screenshot}.png`. Older: NDC-1879, NDC-1866 item 16, NDC-1988.
- Run 1 `executions/execu_2026-10-05_18-05-01/`; run 2 `executions/execu_2026-10-06_23-09-45/` (55 rows, 16 bugs, scripts reusable: prelude helpers mkModule/addFields/placeOnLayout/mkRec). Whole spec after 2 runs: 117 PASS, 38 FAIL, 26 MISSING, 9 INCONCLUSIVE, 6 NOT RUN, 10 INFO.

API how-tos (`/api/v1`, Bearer + x-app-key desk): module `POST /teamspaces/{ts}/modules` (server stores moduleKey as `desk_<key>`); delete `DELETE /modules/{id}?cascade=true`; fields `POST /modules/{id}/fields {fields:[…]}` (one bad field rejects the whole batch; unique peers must already have the field — add peers later with PUT field); layout config (regex, visibilityRule {dependsOn,equalsAny}, autoFill {source,key}, quickCreateTriggers [{value,moduleKey:"desk_tasks"}]) lives in layout field entries; `layout.dependencies` [{id:uuid,parentFieldId,parentValues,action SHOW|HIDE|REQUIRE|OPTIONAL,childFieldIds}]; module Access Control `PUT /modules/{id}/acl` + `PATCH …/access-mode`, record visibility `PUT …/record-visibility {mode}`; field permissions `POST /modules/{id}/field-permissions`; departments PATCH needs the full body, DELETE needs no members (empty them first); profiles add-then-remove with `?scopeId=`.

**Why:** next run (retest after fixes or when gaps are built) should reuse scripts and avoid the traps.
**How to apply:**
- Recycle Bin purge does NOT work for Desk items (200 with failed "unsupported_app", MF-46) — check `failed[]`, don't count 200 as purged.
- One login per account at a time (a second sign-in revokes the first); servers sometimes sign all sessions out — check for 401 TOKEN_MISSING and re-login.
- Run browser sessions one at a time if memory is low (a background group was killed for low memory).
- The record list only shows "Create …" when empty; open forms with the "+" create menu.
- Never capture `/iam/auth` requests (a refresh token once leaked into a log; redacted).
- Desk-only agent: lower `mahmoud.mohamed1` to Desk Agent (restore after); second admin `mahmoud.mmohamedsamy`; third admin `mahmoud.mahamed1515` (CRM Admin + Desk Admin).
- Related: [[zoho-reference-capture]], [[annotate-evidence-vs-zoho]].
