# Desk automation order — feature map

> The memory of this feature. Read it before testing; update it after every run.
> App: TAVI Desk · Reference product: Zoho Desk · Created 2026-11-08

## Where it lives
| What | Path / id |
|---|---|
| List page | |
| Editor / detail | |

## Pages and page objects
| Page object | Covers | Key elements |
|---|---|---|
| `SlaPage` | | |
| `NotificationRulesPage` | | |

## Flows (step by step, as the UI really behaves)
1.

## API
| Method | Path | Used for |
|---|---|---|

## Traps and workarounds
-

## Test inventory
| Case | Test method | Groups (bugs) | Last result |
|---|---|---|---|

## Open bugs covered
| Bug | Test | Status at last run |
|---|---|---|

## Run history
| Date | Scope | Passed | Failed | Healed | Notes |
|---|---|---|---|---|---|

## Run notes (8 Nov 2026)
See `executions/execu_2026-11-08_desk-automation-order/PROGRESS.md`.

Traps:
- SLA policies in a department compete: a leftover `QA AO ` policy matching the same tickets wins. Each test uses its own subject tag; setup removes leftovers.
- Record values need `kind` as the first key (use `AoApi.setField`).
- Admin `mahmoud.mahamed1515` can't read or delete a ticket once it's assigned to an agent. Read as that agent.
- Saved sessions can keep a language in localStorage. `SlaUiTest` forces English before each test.
- Field Update trigger shape: `field_update: {keys: [...], match}`. Escalation level: `{timing, offset, recipients:[{kind,id}], template_ref, actions:{assign_owner, assign_team, set_priority}}`.
- Routes: `/desk/sla/policies/{id}/activate|deactivate|impact|reapply-open|accounts`, `/desk/sla/policies/order?department_id=`, `/desk/sla/support-plans/{id}/discontinue|usage|tickets`.
- Assign through `POST /desk/tickets/{id}/assign {owner_id, team_id}`; the record API refuses owner and team. The admin isn't an agent of QA AO Dept A, so a ticket assigned away can't be read or deleted by admin or by the agent. Keep assignments few.
- Notification rule changes can lag in the agent notice path: wait 60 seconds before a rule-off check.
- `reply.sent` in `/desk/tickets/{id}/activity` shows contact mail. The ticket needs its `email` field, not only `contact_id`.
- Agent addresses are refused as CC; a Gmail +alias works. New templates start `is_active:false`; activating sets the organisation-wide default, so don't. PUT ignores `is_active`.
- Audit log: `/audit/events`. Bell: `/notifications?unread_only|flagged_only`, data under `data.data`. Admin gets 403 on business hours and on `/notifications/admin/policy`.
- Screen captures: `VisualAudit.settle` waits for content. Captures taken before it may be blank.
