# Zoho write ledger — org946877290 (test org), 17 Nov 2026
User approved (17 Nov): confirm home currency EGP in the test org, then QA currency tests, delete after.
| # | Action | Reversible | Cleanup |
|---|---|---|---|
| 1 | Confirm home currency EGP | No (Zoho locks it) | none possible |
| 1 | (done) home currency EGP confirmed 17 Nov | No | — |
| 2 | Add Euro (manual 0.0175) | No delete in Zoho; deactivate at cleanup | deactivate |
| 3 | Tick/untick Auto update (rate prefs) | Yes | DONE: both preferences unticked |
| 4 | Create Deal QA CUR1117 Deal (EUR 1000) | Yes | DONE: deleted + purged from Recycle Bin 17 Nov |
| 5 | Edit Euro rate 0.0175 -> 0.02 | Yes | set back 0.0175 not needed (deactivate) |
| 6 | Deactivate Euro | toggle | DONE: Euro inactive (Zoho cannot delete a currency) |
