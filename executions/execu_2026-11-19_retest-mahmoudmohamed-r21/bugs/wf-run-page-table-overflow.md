# Workflow Rules | Execution run page: actions table runs past its box, cutting off Next / Completed, and Create Record Target shows the module id

**Summary**
On an Execution History run page, the "Dispatched actions" table is wider than the box it sits in. The last column, "Next / Completed", is cut off: the header reads "Next / Comple…" and the times read "19/11/2026 9:…". With one action the table is 9 px too wide; with two actions it is 36 px too wide. On the same page, a Create Record action shows the target module's id under Target instead of the module name. Found while retesting NDC-3105; the developer noted the width there and said it would be fixed separately.

**Steps to Reproduce**
1. Create a workflow rule on Tickets with two actions: Add Tags, and Create Record in Calls (for example one that fails because Contact Name is empty).
2. Create a ticket that fires the rule.
3. Open Setup > Automation > Execution History and open that run (Edge, window 1600 px wide).
4. Look at the Dispatched actions table.

**Expected Result**
- The table fits its box and every column is fully readable, including Next / Completed.
- Target for Create Record shows the module name ("Calls"), the way Add Tags shows tag names.

**Actual Result**
- The table is 1010 px wide inside a 974 px box; the Next / Completed header and times are cut off.
- Target for Create Record shows "f7e488b5-0232-42fd-811c-1f24…" (the Calls module id).

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Edge, 19 Nov 2026. Run 1545578e, rule "QA RT21 W2 3105 part".

**Suggested priority**: Low

**Related**: NDC-3105

**Evidence**: BUG-wf-run-page-table-overflow-FAIL.png
