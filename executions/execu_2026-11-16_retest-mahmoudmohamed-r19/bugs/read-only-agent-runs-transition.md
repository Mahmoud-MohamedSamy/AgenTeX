# Blueprint | An agent with read-only access to a ticket can still run a transition they own and move the ticket

**Summary**
A ticket that an agent may only read (banner "You can read this ticket but not change it") still offers that agent the blueprint transition they own, and Run moves the ticket.

**Steps to Reproduce**
1. Create a blueprint where transition "QA onlyA" (Open → Escalated) is owned only by agent A.
2. Create a ticket in it owned by someone else, so agent A can only read it.
3. Sign in as agent A and open the ticket.
4. Click QA onlyA › Run.

**Expected Result**
- Agent A sees the ticket read-only with no transition button (or a disabled one); a run through the API is refused.

**Actual Result**
- The banner says "You can read this ticket but not change it" and Status is locked, but QA onlyA and Run are offered.
- Run answers 200: #4182 moved Open → Escalated and History shows the agent did it (same on #4174).
- Afterwards the agent gets "This ticket is not available" + "Permission denied."

**Environment**
staging-desk.taviportal.com (NDC-Staging), Microsoft Edge (headless) on Windows 10, 16 Nov 2026, owner account ndc-staging-owner and QA agent "Customer Experience Specialists 2" (Desk Agent, Customer Support).

**Suggested priority**: High

**Related**: NDC-3036, NDC-3056

**Evidence**: screenshots/annotated/BUG-read-only-agent-runs-transition-FAIL.png (spec scripts/specs-bugs/BUG-read-only-agent-runs-transition.json)


