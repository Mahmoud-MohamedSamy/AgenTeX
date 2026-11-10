# NDC-2805 Desk Skills follow-ups after NDC-2752: recheck 9 Nov 2026

Tenant: NDC-Staging, account ndc-staging-owner (creds index 7, Lane D). Numbering follows the Plane ticket.

| # | Item | TAVI now (9 Nov) | Verdict | Evidence |
|---|---|---|---|---|
| 1 | Where-used misses approval processes | The delete dialog and `GET /desk/skills/{id}/usage` return assignment rules, workflow rules and actions, other skills, agents and open tickets. There is no approval-process section. No Desk approval-process screen or API was found: 10 candidate paths all return 404, and the Setup → Automation menu has no Approval entry. So an approval action that names a skill can't be wired up to test the warning. | Still missing | raw/skill-delete-dialog.png, annotated/01 |
| 2 | Remove the old skills tables | The old endpoints `/desk/skill-definitions` and `/desk/skill-settings` now return 404. Whether the tables themselves were dropped can only be seen in the database. | Not checkable from outside | ledger (API) |
| 3 | Department match is case-sensitive on skill rename/delete | This needs an imported ticket whose department id is upper case. Desk stores ids in lower case, so it can't be set up through the UI or API. | Not checkable from outside | — |
| 4 | Restored departments get no skills | Throwaway "QA RT 2805 Dept" with 1 skill type and 1 skill: delete → Recycle Bin → restore. The skill, the type and the preferences were all still there after the restore. The original case is a department deleted before the 4 Nov backfill. That case can't be tested without restoring someone else's department: there is 1 deleted Desk department in the bin, and it isn't ours. | Not reproduced (department deleted now keeps its skills); pre-release case not checkable | item4.json, item4b.json, ledger |
| 5 | Modules & Fields note on the Skills field | No option-editor flash: screenshots at 100, 300 and 700 ms already show the locked note. The ADVANCED note still says only "Desk manages these options. Add, rename and delete skills for each department on the Skills page." It does not say that the API name and the 10-item limit are also locked. The API name box is disabled but shows the generic text used for every field, and the 10-item limit (max_items 10) appears nowhere on the screen. | Partly (flash fixed; note text unchanged) | raw/props-advanced.png, raw/props-t100.png, raw/props-general.png, annotated/01 |

Totals: 0 built, 1 partly built, 1 still missing, 1 not reproduced, 2 not checkable from outside.

Writes (all cleaned up, see ledger.md): department 856b6e94…, skill type 35173e88…, skill f0080c29…. The department was deleted and restored twice for item 4, then deleted for good. The final bin item was purged by id. Checked afterwards: the department returns 404, no bin items are left, and the Skills field has no "QA RT 2805" option.
