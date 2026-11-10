# NDC-1865 functional smoke, Lane G (10 Nov 2026)

NDC-Staging, ndc-staging-owner, API first plus the New Ticket form. All checks ran inside a throwaway department "QA FT 1865 Dept" (agents: owner, Test User 1, QA Team 1). Everything was deleted and purged afterwards (ledger.md).

| # | Feature | Check | Result | Verdict |
|---|---|---|---|---|
| 1 | Modules and Fields | Own layout for the dept + text and picklist fields; ticket with values; bad picklist value | Values saved and read back ("hello 1865", "beta"); "gamma" refused 422 PICKLIST_VALUE_INVALID; New Ticket form shows both fields once the dept is chosen | Working |
| 3 | Direct Assignment | Rule: coming to QA dept + subject contains X → Test User 1 | Ticket → Test User 1; non-matching ticket stays unassigned. The tenant master switch "Direct rules" is OFF on NDC-Staging, so it only ran while switched on (turned on ~20 s, then back off; no other direct rule was active) | Working (switched off tenant-wide) |
| 6 | Round Robin | Sequential RR over Test User 1 + QA Team 1 | 4 tickets → TU1, QA1, TU1, QA1 | Working (see note) |
| 4 | Workflows | On create in dept: inline Field Update (priority High) + Add Tag; second rule using a saved (library) Field Update action | Priority high, tag added, description set by the saved action; both executions logged | Working |
| 5 | SLA + escalation | Policy: response 2 min, resolution 3 min; response escalation 1 min before; resolution escalation at breach = set priority Urgent + assign Test User 1 | Due times set on create (+2/+3 min); after breach: level 1 reached on both, priority urgent, owner Test User 1 | Working |
| 7 | Blueprints | Open → Closed blueprint with one transition | Ticket entered the blueprint (state Open, transition offered); transition ran 200 → status Closed, ticket left the blueprint | Working |

Note (owner default, affects 3 and 6): a ticket created without an owner (API with no owner field, or the New Ticket form with the default owner left) is saved with owner = the creator, so Direct and Round Robin rules do not run on it. Rules ran only when the owner was empty (API owner:null). The form shows "ndc-staging-owner" as owner and sends no owner field (evidence/raw/_ui-before-save.png); the saved ticket matches what the form showed. On 7 Nov a ticket with no owner key was still routed by the rules (assignment run D-14), so this behaviour changed.

Side observation: the department was created with visibility "public" but saved as "private".

Incident: the owner session was revoked once (SESSION_REVOKED) mid-run; signed in again once and continued. The direct-rules master switch had already been restored OFF before that.
