# TIA Assistant: bug drafts (NOT filed; waiting for the user)

Run on 23 Nov 2026, NDC-Staging, against spec docs/tia-assistant/spec-tia-assistant.md. Titles follow the "Feature | Title" format.

## Bugs (from Fail results)

1. **Tia | Simple questions fail with "Sorry, I couldn't answer that just now" or "would you prefer to speak with one of our team?"** (High)
   - Tia's own suggested question "How many open tickets do I have?" failed 3 of 3 times for a Desk agent. The reworded "Count the tickets with status Open that I can see" gave the right answer (40).
   - The same failure happened for:
     - "How many chats are waiting right now?"
     - "Show my QA TIA deal"
     - leads, contacts and deals counted in one question
     - "What did the customer say in T3 last week?"
     - the same open-tickets question in Arabic
   - The second message is customer-bot wording and does not belong in a staff assistant.
   - Cases: I-12, I-28, I-22, I-24, I-09, I-30, I-10, I-05.

2. **Tia | Internal tool errors are shown to the user as the answer** (High)
   - "Missing required argument 'report_id' for the tool call." (pipeline question, I-04, twice)
   - "The report_id must be a UUID copied exactly from the list above…" (team performance, I-15)
   - "Missing valid user_id in UUID format copied exactly from the list above…" (user activity, I-16 and K-09)
   - "Missing valid UUID for 'ticket_id'. Cannot correct without a valid UUID…" (explain an assignment, I-17, twice)
   - "…not among the allowed recipe names for the tia_proposeSetupChange tool…" (E-08, E-12)
   - Team performance, user activity, explain an assignment and pipeline never worked once.

3. **Tia | "List the deals whose name starts with QA TIA" says no such deals exist** (Medium)
   - The deals do exist and are visible to the CRM admin.
   - Tia found "QA TIA Deal 2500" when given the full name.
   - A follow-up question repeats the wrong answer.
   - Cases: I-02, I-25. Leads worked once the Name field was set (I-01).

4. **Tia | "How many tickets were created today?" says none when tickets were created today** (Medium)
   - 6 tickets were created at 14:41 UTC; Tia answered "No tickets were created today" twice.
   - Case: I-26.

5. **Tia | A private ticket comment can never be proposed, although Tia offers "Draft a private comment" on ticket pages** (High)
   - Tia answered: "your workspace admin has not allowed me to make changes to Desk tickets".
   - The write-module picker (/agents/modules) offers only 15 CRM modules, so there is no way to allow tickets.
   - The agent has desk:ticket:comment permission.
   - Cases: J-06, E2E-1, E2E-3.

6. **Tia | "Propose a setup change" only supports 4 fixed recipes; tags and blueprints cannot be proposed** (Medium)
   - The setup page offers "Propose changes" for 182 areas.
   - A ticket tag request was refused, listing the internal recipe names assignment_by_lead_source, approval_above_amount, task_on_lead_created and sla_by_priority.
   - "Propose a blueprint" (turned on) never produced a card in 3 tries.
   - Cases: E-12, J-08, E-08.

7. **Tia | Changes to "Agent Instruction" have no effect** (Medium)
   - The instruction "Always end every answer with the exact token QA-END" was saved and deployed (v13).
   - It was followed in 0 of 4 answers.
   - Case: E-16.

8. **Tia | Tia setup changes are not written to the audit log** (Medium)
   - 9 draft saves, 7 deploys, a deactivate, a delete and a restore: none of them is in /audit/events.
   - AI policy (Tia switch and caps) changes are missing too.
   - Records that Tia creates are logged correctly, with channel "tia".
   - Case: B-21.

9. **Tia | A change to two records gives one card and silently drops the second** (Medium)
   - Request: "Change the lead source of QA TIA Lead 2 and QA TIA Lead 3 to other".
   - The answer says both were prepared; only Lead 2 has a card.
   - Case: J-24.

## Findings (lower; for the user to decide)

**Setup page**
- B-13: PUT /agents/{id}/draft with a partial definition wipes tools, write modules and instructions (200).
- B-12b: a draft save with no expected_updated_at is accepted, which risks lost updates.
- C-10: the API accepts enabled_apps [] and treats it as all apps. The UI blocks it.
- G-05 / G-16: the API silently clamps out-of-range values instead of refusing them:
  - per-user limit -1 is saved as 0, which blocks everyone
  - stronger-model steps 11 → 10, -1 → 0, 101 → 100
- G-12: cap changes sometimes take about 45 s to apply, although the page says "applies at once".
- D-06: the owner is locked out of the chat when the audience does not list them.
- B-01b: the Settings menu shows both "Tia Assistant" and "Tia" for the same page.
- E-01b: a raw translation key, "agents.wizard.kb.uploadTitle", is shown in the Knowledge Base tab.

**Chat panel**
- B-16: a deactivated Tia reports reason "not_configured", so users read "Tia has not been set up…".
- E-02: "What Tia can see" lists CRM, Analytics and "Propose a ticket comment" to a Desk agent who has no CRM access and can't use ticket comments.
- M-06: the panel is marked as a dialog, but keyboard focus is not kept inside it.
- L-03: after a cut stream the turn is not_found. The message says "try again to see the reply", but the reply is lost and is charged again.

**Answer quality**
- E-07: a workflow card ignores the requested rule name and shows raw JSON for the trigger and actions.
- E-07: a misleading "no permission" message appears when the cause is the write-module list.
- E-10: when an area's Explain is off, the reason given is wrong ("requires the account ID").
- J-01 / J-04: action cards show field keys (first_name) instead of labels, and update cards show only the new value.
- J-15: a card is offered for an invalid record, and its failure shows the raw code RECORD_VALIDATION_FAILED.
- I-19: setup explanations are generic and don't name the tenant's rules.
- I-20: setup steps mix in unrelated content and give no citation link.
- I-21: Desk KB articles are not used until KB sync is set up in the Desk integration settings (not set up on this tenant).
