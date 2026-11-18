# Ticket Import | Ticket Owner given by agent name is not matched and silently replaced by the importer, result shows 0 errors

**Summary**
When tickets are imported with a Ticket Owner column that holds the agent's name, the owner is never matched, even for an active agent who is a member of the ticket's department. Every such ticket is given to the person who runs the import. The import finishes as "Import complete" with 0 errors, so the user is not told that the owners were replaced. The same owner given as the agent's email address is matched correctly. Seen first in the NDC-2275 retest (#4558).

**Steps to Reproduce**
1. Prepare a CSV with columns Subject, Department, Status, Priority, Ticket Owner and two rows in QA AS6 Dept A: one with Ticket Owner "Test User 1" (member of QA AS6 Dept A), one with "Mahmoud Samy" (an agent who is not a member of that department).
2. Go to Setup > Data > Import, choose Tickets, upload the file, Add new records.
3. On Map fields, check that Ticket Owner is mapped to Ticket Owner.
4. On Assign, leave "Trigger automation and process management" unticked. Submit.
5. Look at the Result page and open the two new tickets.
6. Repeat with automation ticked.
7. Repeat with one row whose Ticket Owner is Test User 1's email address.

**Expected Result**
- A row whose owner names an eligible agent (here Test User 1) gets that agent as owner, whether the file gives the name or the email.
- A row whose owner cannot be used (not found, or not in the department) is shown on the Result page as an error or warning (e.g. "Row 3: owner 'Mahmoud Samy' is not in QA AS6 Dept A; assigned to you"), and the error count includes it.

**Actual Result**
- Automation unticked: #4622 (Test User 1) and #4623 (Mahmoud Samy) are both owned by the importer.
- Automation ticked: #4624 and #4625, same.
- Each import session stores, for both rows, "No eligible user matches '<name>'.", but error_count is 0. The Result page says "Import complete", 0 Errors, and the history row says "2 added · 0 errors".
- With the email address, #4630 is owned by Test User 1 (matched, no errors).
- The earlier NDC-2275 import (#4558, owner "Mahmoud Samy") behaved the same way.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Setup > Data > Import (Tickets), QA AS6 Dept A, 16 Nov 2026 12:27–12:40Z.

**Suggested priority**: Medium (imported tickets silently go to the wrong owner; nothing on screen tells the user)

**Related**: NDC-2275

**Evidence**: BUG-import-owner-name-not-matched-FAIL.png
