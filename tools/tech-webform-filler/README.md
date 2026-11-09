# Tech Webform filler

Sends one ticket per row of an Excel (or CSV) sheet through the TAVI Desk **Tech Webform**, the way a visitor would.
For each row it opens the form's iframe page in Edge, fills the fields, clicks **Send** and records what the form answered.

Every row marked **SENT** creates a real ticket in the **Tech** department on NDC-Staging.

## First time

```
cd tools\tech-webform-filler
npm install
```

It uses Playwright from the project's `node_modules` and the installed Microsoft Edge (no extra browser download).

## Run

1. Fill `tech-webform-tickets.xlsx` (sheet **Tickets**). Row 1 holds the column names; add one ticket per row.
   - Red headers are required by the form: **Subject**, **Last Name**, **Email**.
   - Classification, Priority, Category and Sub Category have drop-downs. The allowed values are on the **Options** sheet.
   - **Skills**: several values separated by `;`, for example `tier_1_support; billing`.
   - **Due Date**: an Excel date/time, or text like `2026-11-20 09:30`.
   - **Attachments**: file paths separated by `;`, relative to the sheet.
   - Empty cells are skipped. Columns the form doesn't have are reported and ignored.
2. Check first without sending anything:
   ```
   node fill-webform.js --file tech-webform-tickets.xlsx --dry-run
   ```
   This fills every row, saves `dry-run-row-N.png` next to the sheet and clicks nothing.
3. Send:
   ```
   node fill-webform.js --file tech-webform-tickets.xlsx
   ```
   Or double-click `run.cmd`, which sends `tech-webform-tickets.xlsx`.

The results are written next to the sheet as `<sheet>-results-<time>.csv`. Each row gets one of these statuses:

| Status | Meaning |
|---|---|
| SENT | The form accepted it ("Thank you. Your request has been submitted."), so a ticket was created. |
| NOT SENT | The form blocked it in the browser, and the message names the missing or invalid fields. |
| REFUSED | The server rejected it, and the server's message is shown. |
| ERROR | The page didn't load, or something else went wrong. |

## Options

| Option | Meaning |
|---|---|
| `--rows 2-5` | Only these rows (1 = the first row under the header). |
| `--sheet Name` | Read a different sheet (default: the first sheet). |
| `--headed` | Show the browser window while it works. |
| `--delay 3000` | Pause between rows in ms (default 1500). |
| `--url "<iframe address>"` | Another form's iframe address, from that form's **Embed code → Hosted link and iframe**. The fields are matched by their labels, so any TAVI web form works. |
| `--browser chrome` | Use Chrome instead of Edge. |

## Needs

- Tech Webform must stay **enabled**, with **Allow hosted link / iframe** on (Setup → Channels → Web Forms → Tech Webform). Otherwise the form page stays empty and every row ends in ERROR.
- If someone changes the form's choice options, run `node make-template.js new-sheet.xlsx` to get a template with fresh drop-downs, or edit the Options sheet.
