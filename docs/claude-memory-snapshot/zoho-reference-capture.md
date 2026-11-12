---
name: zoho-reference-capture
description: "How to sign in to the reference Zoho CRM org and capture it on this machine (Edge only, credentials file, read-only)"
metadata:
  node_type: memory
  type: reference
  originSessionId: d33c9114-f581-4680-8ca0-3e003df6adb4
  modified: 2026-10-04T10:51:02.591Z
---

- Zoho org: org940103646 (crm.zoho.com), admin account. Credentials: `docs/Credentials/ZOHO CRM Credentials.json` (keys `email`, `password`; folder is gitignored; an Edge password export sits beside it). Read without printing.
- Sign-in: accounts.zoho.com `#login_id` → `#nextbtn` → `#password` → `#nextbtn`; no OTP was asked (4 Oct 2026). Save storageState and load it into a playwright-cli session.
- **Must use Edge** (`chromium.launch({channel:'msedge'})`, `playwright-cli open --browser=msedge`): bundled Chromium gets `ERR_HTTP2_PROTOCOL_ERROR` on static.zohocdn.com and Zoho stays on "Loading". A session saved from Chromium triggers a relogin in Edge.
- Zoho list view: Leads is in dropdown layout, Deals in tab layout; tab menu = Edit / Pin / Clone / Close View / Delete View; picker footer "Show custom views as Tab/Dropdown".
- Keep captures read-only; ask before any Zoho change (pinning, layout switch, creating views).

Related: [[annotate-evidence-vs-zoho]]

**Full-edition Zoho CRM org (18 Oct 2026):** org940103646 is a free-level edition (no Assignment / Process Management). Use **org943261092** = row 1 of `docs/Credentials/Zoho Desk Credentials.csv` (header `username,password`) — has Assignment, Blueprint, Approval/Review Processes, Scoring, CommandCenter. Row 2 (outlook account) = org931277617, also limited. Both passwords contain "@" — never regex-mask credential cells; print only column 0.


27 Oct 2026 (NDC-2302): the user waived the read-only rule "for now" for that check only; created/imported leads and a blueprint in org943261092 then deleted them. Zoho: import with "trigger blueprint" off → record not in the blueprint; on → in; manual create → in. 2 Import History rows remain (Zoho can't delete them). Default stays read-only.

9 Nov 2026 (NDC-2275 GEN-13): user approved a write test on the Zoho Desk test account (techsolutionsegypt, CEO Fathy Mehanna): temp RR rule + 1 manual ticket + 2-row import, then all deleted and purged. Import history rows can't be removed. Default stays read-only.

11 Nov 2026 (Global Sets intake): user allowed READ AND WRITE in the Zoho CRM test org **org944965048** (hmohammed@ Enterprise trial, ends 17 Nov 2026; saved state copied from r15 state-zc2.json) — "continue with the test org, read and write". Not NDC's real Zoho (never write there). Prefix QA GS1111, ledger, delete after.

**Zoho Desk credentials (user, 12 Nov 2026):** use `docs/Credentials/Zoho hmohamed@anyware.software.txt` (line 1 email, line 2 password; never print). Signs in to desk.zoho.com from Edge with no OTP. Helper: executions/execu_2026-11-12_desk-skills-parity/scripts/zd-server.js (port 8893) + z.sh.
