# Ticket History | Automatic blueprint steps show the wrong From state and To state

**Summary**
When a blueprint step runs by itself (continuous blueprint or timer), its History line shows From state Open and To state Escalated, whatever the real move was. The status line next to it shows the real move.

**Steps to Reproduce**
1. Create a continuous blueprint: Open → Escalated ("first", one checklist item) → On Hold ("auto", nothing to fill) → Closed ("end", nothing to fill).
2. Create a matching ticket and run "first".
3. Wait a few seconds; the ticket moves to On Hold and Closed by itself.
4. Open the ticket › History.

**Expected Result**
- "Moved by <blueprint> automatically · Transition QA auto" shows From state Escalated, To state On Hold; QA end shows On Hold → Closed.

**Actual Result**
- QA auto and QA end both show From state Open, To state Escalated (tickets #4165, #4166).
- The Status changed lines next to them are correct (Escalated → On Hold, On Hold → Closed).
- GET /desk/tickets/{id}/history: the ticket.blueprint_transition rows carry only the transition name, no from/to state.

**Environment**
staging-desk.taviportal.com (NDC-Staging), Microsoft Edge (headless) on Windows 10, 16 Nov 2026, owner account ndc-staging-owner.

**Suggested priority**: Medium

**Related**: NDC-3034 (From/To added to transition lines), NDC-3031 (continuous blueprints)

**Evidence**: screenshots/annotated/BUG-history-auto-step-wrong-from-to-FAIL.png (spec scripts/specs-bugs/BUG-history-auto-step-wrong-from-to.json)


