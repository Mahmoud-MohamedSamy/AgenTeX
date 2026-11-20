# Workflow Rules | Opening a rule whose Create Record sets Contact Name to ${contact_id} shows "The requested resource was not found."

**Summary**
When a workflow rule has a Create Record action whose Contact Name is set to the ticket's contact with the placeholder ${contact_id}, opening the rule shows the error "The requested resource was not found." straight away. The editor looks the placeholder up as if it were a contact record id (the request fails with 404), and the Contact Name box shows "Contacts ${contac" as a record search. A rule without Create Record opens with no error. Found while retesting NDC-3119.

**Steps to Reproduce**
1. Go to Setup > Automation > Workflow Rules and create a Tickets rule with a Create Record action: target module Calls, Contact Name = ${contact_id}. Save it.
2. Go back to the list and open the rule (row menu > Edit).
3. Watch the bottom right of the screen, then scroll to Field Values.

**Expected Result**
- The rule opens with no error.
- Contact Name shows the placeholder clearly (for example "${contact_id}" or "Ticket > Contact"), not as a contact search.

**Actual Result**
- The toast "The requested resource was not found." appears as soon as the rule opens, with no click.
- Contact Name shows "Contacts ${contac" in a record search box.
- A rule without Create Record ("QA RT21 W2 3115 rapid") opens with no toast.

**Environment**
staging-desk.taviportal.com (NDC-Staging), owner account, Edge, 19 Nov 2026. Rule "QA RT21 W2 3105 part".

**Suggested priority**: Low

**Related**: NDC-3119

**Evidence**: BUG-wf-editor-contact-placeholder-not-found-FAIL.png
