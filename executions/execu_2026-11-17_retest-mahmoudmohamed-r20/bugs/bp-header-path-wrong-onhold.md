# Blueprint | Ticket header progress bar and Steps card lose the path when a ticket moves Open → On Hold

**Summary**
A ticket's blueprint progress bar (header) and Steps card should show the states it passed through and what comes next. For a ticket moved Open → On Hold, the bar reads "On Hold · Closed · Open · Escalated": Open, the state it came from, is shown after the current state as if it were still ahead, and Escalated, which is not on its path, is listed. The Steps card shows only "On Hold — Now" with no "Open" done. A ticket moved Open → Escalated in the same blueprint shows it correctly ("Open ✓ · Escalated · Closed"). Found while retesting NDC-3056.

**Steps to Reproduce**
1. Blueprint "QA RT20 BS 3056 flow" (Customer Support): Open → On Hold (Shown when Priority = high), Open → Escalated, On Hold → Closed, Escalated → Closed, Closed → Open.
2. Create a ticket with Priority High (#5118); it enters Open.
3. Run "QA urgent" (Open → On Hold).
4. Open the ticket and look at the progress bar under the header and the Steps card.
5. Compare with #5117 moved Open → Escalated.

**Expected Result**
- Bar: Open (done) → On Hold (current) → Closed (next), like #5117.
- Steps card: Open ✓, On Hold — Now, Next step Closed.

**Actual Result**
- Bar: On Hold (current) · Closed · Open · Escalated.
- Steps card: On Hold — Now, Next step Closed; Open not shown as done.
- #5117 (Open → Escalated): bar Open ✓ · Escalated · Closed, Steps card Open ✓ — correct.

**Environment**
staging-desk.taviportal.com (NDC-Staging), agent CES2, Edge, 18 Nov 2026. Tickets #5118, #5117. Not checked: whether it depends on who ran the step (the owner ran it on #5118, the agent on #5117).

**Suggested priority**: Low

**Related**: NDC-3056

**Evidence**: BUG-bp-header-path-wrong-onhold-FAIL.png
