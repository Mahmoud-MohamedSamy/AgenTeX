---
name: crm-custom-views-gap-analysis
description: "CRM Custom Views parity work vs Zoho CRM — PRD, gap ticket, spec path, and the 2 Oct 2026 live Zoho re-check results"
metadata:
  node_type: memory
  type: project
  originSessionId: 891db4a9-d8c6-4bb0-97f6-1857c87b5d24
  modified: 2026-10-02T19:58:11.063Z
---

CRM Custom Views (crm.taviportal.com, tenant NDC-Staging): PRD is NDC-1868, gap ticket is NDC-1869 (22 items, Backlog, CRM module), spec is `docs/custom-views/spec-crm-custom-views-v2.md` (Group Z maps to NDC-1869 item numbers).

Re-check on 2 Oct 2026 against the live Zoho CRM org (org940103646, login in `docs/Credentials/ZOHO CRM Credentials.json`; read-only, nothing created) and build bundle `index-DfcbYBNN.js`: all 22 items still stand. New gaps seen live and not yet in NDC-1869 (not filed, waiting for the user's decision): saved filters ("Save filter"), "Lock this View", Wrap Text view mode and Reset Column Size, A–Z letter filter on the name column, owner criteria "belongs to Role / does not belong to Role", date criteria "Previous / Next N days|weeks|months|years", text operators on pick lists, bulk delete of views on the Manage page, "Filter By Related Modules" in the filter panel, selection actions Cadences / Print Mailing Labels / Export Selected Records, Assignment Rules in the module menu. Live Zoho confirmed the user's earlier withdrawals: view menu is only Edit / Pin / Clone / Delete View (no favourite, no set-default, no "Other users' views" group).

Build notes: a tenant fiscal-year setting exists (`companySettings.fiscalYear.*`), so the spec's "no fiscal setting found" note is outdated. View code lives in lazy chunks (`pages-*.js`, `useListViewModule-*.js`, `filter.helpers-*.js`), not in `index-*.js`; `/locales/*.json` returns the SPA shell without login.

**Why:** Zoho's help pages lag the live product, so doc-only findings were wrong before (favourites, default view).

**How to apply:** check the live Zoho org before calling something a gap; Zoho's UI is built from custom elements, so drive it with playwright-cli `run-code` and coordinates/`lyte-drop-item` text rather than aria snapshots. Kanban board behaviour (sort cards, reorder views) was not re-checked live because it needs a Kanban view to be created.

- Deliverables on 2 Oct 2026 (v3, draft for review): `docs/custom-views/custom-views-requirements-v3.md` (CVR-… requirements), `spec-crm-custom-views-v3.md` (adds D25, Z28–Z55), `Custom Views - Spec v3 Test Cases.xlsx` (238 cases: 209 old + 29 new), `custom-views-missing-list.md`. v2 files are kept unchanged.
