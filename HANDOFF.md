# Handoff — continue on another device (13 Nov 2026, ~01:45 Cairo)

## Where things stand
- **Desk automation order** (`executions/execu_2026-11-08_desk-automation-order/`): read `PROGRESS.md` (last section "A6 Blueprint — PAUSED") and `ledger.md`.
  - A4 Workflow: all 274 cases executed; bugs filed NDC-2948..2968, 2973, 2997–2999. E2E-3 waits for a Gmail check (tickets #3313–#3316: ONE before the template edit, TWO after).
  - **A6 Blueprint: paused at 140 of 187 rows.** Results per row: `a6/results.json` (add with `node a6/rec.js STATUS "ROWS" "note"`). Left: A2 B1 B3 B4 B10 B11 C8 E14 F2 H3 H11 J1 J10 J11 J12 K3 K4 K5 M1 M2 M3 M5 N1 N8 N10 N11 Z1–Z15 E2E-1..6.
  - Next after A6: A8 Macros, Part B, Part C.
- **Desk go-live retest** (`executions/execu_2026-11-01_desk-golive/`): Wave 4 filed NDC-3000..3008; Wave 5 next (read its `PROGRESS.md`).

## Left on purpose on NDC-Staging
- Custom action "QA BP echo" `52f80185-f971-4321-aafd-20d2bba0717f` and API source `80412d3b-36db-4f6f-9044-49d62f5eae38` (needed by A6 F/K rows; delete at the end of A6). Listed in `a6/made.json`.

## Not in git — copy these to the other device by hand
- `docs/Credentials/` (TAVI Desk Credentials.csv, now with row `anyware-staging-owner`; Zoho and other login files).
- `automation/.auth/extra-credentials.csv` (Anyware owner for the Java deskblueprint tests) — or recreate it from the CSV row.
- `D:/Learning & Work/Software Testing/Anyware Software/secret-key-1793537440144.csv` (Plane API key, outside the repo).
- `node_modules` (run `npm install` at the repo root; Playwright browsers: `npx playwright install msedge firefox` if needed).

## Claude memory
- A copy of the Claude Code memory is in `docs/claude-memory-snapshot/`. On the new device, copy those `.md` files into the Claude project memory folder for this repo (`~/.claude/projects/<project-path>/memory/`), or ask Claude to read `docs/claude-memory-snapshot/MEMORY.md` first.
- Then tell Claude: "continue A6" — it should read `executions/execu_2026-11-08_desk-automation-order/PROGRESS.md` and `a6/results.json`.

## Paths that are machine-specific
- Scripts point at `D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX` and a session scratchpad under `C:/Users/a/AppData/Local/Temp/claude/...` (copies of the screen-step scripts are in `executions/execu_2026-11-08_desk-automation-order/session-scratch/ui` and `/z`; `a6/bp/` and `a4/` scripts are in place). Adjust the root path if the repo sits elsewhere.
