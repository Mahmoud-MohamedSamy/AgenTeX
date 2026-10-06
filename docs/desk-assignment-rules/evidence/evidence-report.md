# Evidence — Assignment rules: TAVI Desk vs Zoho Desk

| | |
|---|---|
| App | TAVI Desk — `https://staging-desk.taviportal.com` (tenant NDC-Staging), owner and second admin |
| Reference | Zoho Desk, live org "anywaresoftwaredesk" (Enterprise trial), admin "CEO", headless Edge |
| Date | 6 Oct 2026 |
| Missing list | [`../desk-assignment-rules-missing-list.md`](../desk-assignment-rules-missing-list.md) (items 1–15) |
| Test spec | [`../spec-desk-assignment-rules.md`](../spec-desk-assignment-rules.md) (Group Z rows Z1–Z15) |
| Status | Draft for review. Nothing filed in Plane |

How to read each image:
- **TAVI** is on the left (red), and **Zoho Desk** is on the right (blue).
- The numbered boxes on the screenshots match the **#** column of the table under them.
- **Match** is one of: Gap (Zoho has it, TAVI does not), Differs, Same as Zoho, TAVI extra, or Not checked.
- A text panel instead of a screenshot is marked **DOCS ONLY** (Zoho help pages), **FROM THE BUILD'S CODE** (TAVI bundle or strings) or **FROM THE LIVE API**.
- The TAVI shots for items 3, 4 and 5 show a drop-down list opened out on the page so that every option is visible at once; nothing else on the page was changed.

All captures were read-only. Forms were opened, captured, then closed with Cancel or Escape. No assignment save request was sent in either app. The only tenant change was the 5 TAVI departments created at the user's request. The unannotated screenshots are in [`originals/`](originals/). To rebuild an image, edit `configs/items-02-15.js` (or `configs/01-run-on-update.json`), run `node configs/items-02-15.js`, then `node make-evidence.js configs/<item>.json`.

## Summary

| # | Gap | Spec row | Plane | Evidence | Verdict |
|---|---|---|---|---|---|
| 1 | Run an assignment rule when a ticket is updated, not only when it arrives | Z1 | NDC-1978 (1) | TAVI live · Zoho live | Gap |
| 2 | "Move Ticket to" another department as a rule action | Z2 | NDC-1978 (2) | TAVI live · Zoho live | Gap |
| 3 | Execution-time criteria: during / outside business hours, holiday / not a holiday | Z3 | NDC-1978 (3) | TAVI live · Zoho live | Gap |
| 4 | Date fields and date / number operators in rule criteria | Z4 | NDC-1978 (4) | TAVI live · Zoho live | Gap |
| 5 | Criteria on contact and account fields, and on ticket owner, team, tags and dates | Z5 | New | TAVI live · Zoho live | Gap |
| 6 | One switch to turn all direct rules, or all round-robin rules, on or off | Z6 | New | TAVI live · Zoho live | Gap |
| 7 | Exclude chosen agents when round robin uses a team's members | Z7 | NDC-1978 (5) | TAVI live · Zoho docs | Gap |
| 8 | Round robin only to online agents, with an "Assign tickets to offline agents" switch | Z8 | New | TAVI live · Zoho live | Gap |
| 9 | Department-wide ticket limit and per-agent limit | Z9 | New | TAVI live · Zoho live | Gap |
| 10 | Backlog options: on/off per department, how many and in which order | Z10 | New | TAVI live · Zoho live | Gap |
| 11 | Skills management: skill types, skills with criteria stamped on tickets, agents per skill | Z11 | NDC-1978 (6) | TAVI live · Zoho live | Gap |
| 12 | Workflow action that assigns a ticket to a team or to an agent in a team | Z12 | New | TAVI code · Zoho docs | Gap |
| 13 | AI suggestion of the ticket owner (Zia Field Predictions) | Z13 | New | TAVI code · Zoho docs | Gap |
| 14 | Assignment notifications per department, per channel, with editable templates | Z14 | New | TAVI live · Zoho live | Gap |
| 15 | Assignment API coverage | Z15 | New | TAVI API · Zoho docs | Gap |

## 1. Run an assignment rule when a ticket is updated, not only when it arrives

![Item 1](01-run-on-ticket-update-vs-zoho.png)

## 2. "Move Ticket to" another department as a rule action

![Item 2](02-move-ticket-to-vs-zoho.png)

## 3. Execution-time criteria: during / outside business hours, holiday / not a holiday

![Item 3](03-business-hours-criteria-vs-zoho.png)

## 4. Date fields and date / number operators in rule criteria

![Item 4](04-date-number-operators-vs-zoho.png)

## 5. Criteria on contact and account fields, and on ticket owner, team, tags and dates

![Item 5](05-criteria-fields-vs-zoho.png)

## 6. One switch to turn all direct rules, or all round-robin rules, on or off

![Item 6](06-master-switch-vs-zoho.png)

## 7. Exclude chosen agents when round robin uses a team's members

![Item 7](07-exclude-agents-vs-zoho.png)

## 8. Round robin only to online agents, with an "Assign tickets to offline agents" switch

![Item 8](08-online-agents-only-vs-zoho.png)

## 9. Department-wide ticket limit and per-agent limit

![Item 9](09-thresholds-vs-zoho.png)

## 10. Backlog options: on/off per department, how many and in which order

![Item 10](10-backlog-options-vs-zoho.png)

## 11. Skills management: skill types, skills with criteria stamped on tickets, agents per skill

![Item 11](11-skills-vs-zoho.png)

## 12. Workflow action that assigns a ticket to a team or to an agent in a team

![Item 12](12-workflow-assign-team-vs-zoho.png)

## 13. AI suggestion of the ticket owner (Zia Field Predictions)

![Item 13](13-ai-owner-prediction-vs-zoho.png)

## 14. Assignment notifications per department, per channel, with editable templates

![Item 14](14-notification-rules-vs-zoho.png)

## 15. Assignment API coverage

![Item 15](15-api-vs-zoho.png)
