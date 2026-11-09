// Writes results.json (NDC-2203 retest, 26 Oct 2026) and ledger.md (from ledger.json) for make-report-html.js.
// Usage: node scripts/make-results.js
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const P = 'PASS', F = 'FAIL', I = 'INFO';
// [#, item, expected, how checked, now, result, label for INFO]
const items = [
    ['A1', 'Customer Reply trigger', 'Rule fires when the customer replies', 'Agent reply from the Customer Support mailbox (ticket #578); customer replied from Gmail', 'Inbound 13:34:42 (trusted) → rule QA WF A1 fired 13:34:46, comment added 13:34:49. A reply marked untrusted (anyware.software, DKIM not aligned, #577) did not fire the rule', P],
  ['A2', 'Agent Response trigger', 'Rule fires on an agent reply', 'Agent reply on a QA ticket', 'Fired within seconds', P],
  ['A3', 'Comment trigger', 'Rule fires on a comment; public / private filter', 'Rule "public only"; private comment, then public comment', 'Private: not fired. Public: fired', P],
  ['A4', 'Private Thread trigger', 'Choose incoming, outgoing or both', 'Ticket Event panel, saved trigger, a forward from the ticket', 'Fires on a forward, but there is no incoming / outgoing / both choice (only Comment and Rating have sub-options)', F],
  ['A5', 'Happiness Rating trigger', 'All ratings or good / okay / bad', 'Rules for all / good / bad; Send happiness email rule', 'Options are offered; no rating possible: Customer Happiness is disabled on staging (send: reason "disabled"), not changed per your answer', I, 'Not testable'],
  ['B1', 'Add Comment (public / private)', 'Comment added with the chosen visibility', 'Two Create rules, one each', 'Private and public comments added, author System', P],
  ['B2', 'Send Email Reply', 'Reply emailed to the customer', 'Create rule, contact = QA mailbox', 'Reply status sent, sent_to = contact', P],
  ['B3', 'Reply via Instant Messaging', 'Offered / works', 'Action picker', 'Hidden: needs a WhatsApp brand in SalesIQ (not configured, shared setup not changed)', I, 'Not testable'],
  ['B4', 'Notify via Instant Messaging', 'Offered / works', 'Action picker', 'Hidden for the same reason', I, 'Not testable'],
  ['B5', 'Add Followers', 'Agent follows the ticket', 'Create rule, follower = me', 'followers = [me]', P],
  ['B6', 'Mark as Spam', 'Ticket marked spam', 'Create rule', 'is_spam = true', P],
  ['B7', 'Share Ticket', 'Ticket shared with a department', 'Create rule, HR, read_only', 'shared_departments = [HR]', P],
  ['B8', 'Change Layout', 'Ticket moves to another layout', 'Create rule → new "QA WF Layout" (copy of Standard, no profiles)', 'changed: true, layout = QA WF Layout', P],
  ['B9', 'Custom Functions', 'Offered', 'Developer: moved to NDC-1989, Run Custom Action instead. QA custom action targeting Desk, published, run by a rule', 'Run custom action offered once a Desk custom action exists; rule run succeeded; also under the ticket header Actions menu', P],
  ['B10', 'Send Cliq Notification', 'Offered', 'Developer: Cliq does not apply; Slack / Teams / Google Chat instead', 'Chat actions hidden: Slack connection "uninstalled", none connected (not changed)', I, 'Not testable'],
  ['B11', 'Add Skills', 'Skills added', 'Create rule, tier_1_support', 'skills = [tier_1_support]', P],
  ['B12', 'Remove Skills', 'Skills removed', 'Ticket created with tier_1 + tier_2, rule removes tier_1', 'skills = [tier_2_support]', P],
  ['B13', 'Recalculate Skills', 'Skills follow their criteria', 'Create rule', 'Succeeded, changed: false — no skill on staging has criteria, so nothing to recalculate', I, 'Limited'],
  ['B14', 'Reassign based on Skills', 'Owner = agent holding the skills', 'Create rule, ticket with tier_1_support', 'Succeeded, reassigned: false, reason nobody_online', I, 'Limited'],
  ['D1', 'Assign Tickets to a team', 'Team, round robin / load balancing', 'Owner Assignment › Teams (Customer Experience Specialists) on a Create rule and on an Edit rule', 'Edit rule: team set, owner cleared (agent sees it in the team). Create rule: rule runs before the ticket row is written; ticket keeps owner = creator, no team', F],
  ['D2', 'Email alerts', 'Desk templates; users / teams / roles / contact', 'QA Desk template; rule to Contact + User; Team and Role validated without sending', 'agents_emailed 1, contact_emailed true; Team / Role accepted; Contact without a Desk template refused', P],
  ['D3', 'Field Changed: up to 3 fields', 'Watch 3 fields in one rule', 'API + editor ("+ Add a field")', '3 accepted, 4th refused ("watches at most 3 fields")', P],
  ['D4', 'Field Changed: All / Any', 'Fires when all or any change', 'Any: one field changed. All: 2 of 3, then 3 of 3 in one save', 'Any fired; All did not fire on 2 of 3, fired on 3 of 3', P],
  ['E1', 'Contact and Account fields', 'Conditions on contact / account fields', 'Picker (82 fields), Contact · Title and Account · Account Name rules with match / no-match tickets', '19 Contact · and 16 Account · fields; both rules matched only the right ticket', P],
  ['E2', 'Execution Time', 'During / outside business hours, holiday', 'Three rules; staging business hours are 24/7', 'business_hours fired; outside_business_hours and holiday did not', P],
  ['E3', 'Missing ticket fields', 'The 20 fields + Zoho extras', 'Picker list; Created By and Is Overdue rules', 'All offered except Name (developer: tickets have no Name); Created By matched; Is Overdue is false in Create rules (true in Edit rules)', P],
  ['E4', '"doesn\'t contain"', 'Text operator', 'Picker + rule with match / no-match tickets', 'Offered; matched only the ticket without the text', P],
  ['E5', '"between" / "not between"', 'Date operators', 'Picker + two rules, due dates inside / outside the range', 'Offered; both matched only the right tickets', P],
  ['E6', '"Current Time" as a value', 'Date compared with now', 'Picker ("Compare with") + rule Due Date before Current Time', 'Offered; past due date matched, future did not', P],
  ['F1', 'Saved actions cover the new actions', 'New action types can be saved and reused', 'Saved "Add comment" action used by a rule', 'Saved; rule ran it on a QA ticket', P],
  ['F2', 'Department-scoped rules', 'Rule runs only in its departments', 'HR-only rule; HR ticket and Customer Support ticket', 'Fired on HR, not on Customer Support', P],
  ['F3', 'Active / Inactive tabs', 'Tabs filter the list', 'Deactivated one QA rule', 'All 13 / Active 12 / Inactive 1, Inactive shows only that rule', P],
  ['F4', 'Ticket History names the rule', 'Rule name, action, status', 'History tab of a QA ticket', '"Workflow rule ran — Rule QA WF D4all · Triggered by An edit · Actions AddTicketComment"', P]];
const n = k => items.filter(r => r[5] === k).length;
const R = { batch: 'Desk', title: 'Retest — Mahmoud Mohamed · NDC · 1 ticket (Desk Workflow Rules)', date: '26 Oct 2026',
  env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge headless + API · mahmoud.mahamed1515 (Desk Administrator); fedelav803 (Desk Agent) to read a team ticket',
  devNote: `Developer (26 Oct 10:41 UTC): every item deployed except Custom Functions (→ NDC-1989, Run Custom Action instead) and Cliq (N/A). Result: ${n(P)} pass, ${n(F)} fail, ${n(I)} not testable or limited, of ${items.length} items. Every item was used on a QA ticket and checked on the ticket, in Execution History and Ticket History.`,
  tickets: [{ id: 'NDC-2203', uuid: '2f7deb90-a42b-43ea-b910-41b4cb4d8114', pri: 'Urgent', mod: 'Desk', feat: 'Workflow Rules', title: 'DESK Workflow Missings', v: 'PARTIAL',
    dev: 'All items on staging-desk except Custom Functions (planned in NDC-1989; Run Custom Action shipped instead) and Send Cliq Notification (does not apply; Slack, Teams and Google Chat instead).',
    devHeld: 'Mostly. Both exceptions hold. Two items do not work as described: Private Thread has no incoming / outgoing / both choice, and Assign Tickets to a team is ignored by Create rules.',
    summary: `${n(P)} of ${items.length} items pass. 2 fail (A4, D1). ${n(I)} cannot be fully tested on staging without changing shared setup (Customer Happiness off, no WhatsApp brand, no chat connection, no skill criteria, no online skilled agent). Customer Reply (A1) fired on a real customer reply.`,
    still: ['A4 Private Thread: expected a choice of incoming / outgoing / both; the trigger has none (it fires on a forward).',
      'D1 Assign to team: on a Create rule the ticket keeps owner = creator and gets no team (rule ran at 12:01:52.602, ticket row written at 12:01:52.711). Works on an Edit rule.'],
    items, img: ['NDC-2203-retest-PARTIAL.png'] }],
  observations: [
    ['New defect', 'On Edit rule fires on a brand-new ticket', 'QA WF D1e (On Edit) ran at 12:04:26 on a ticket created at 12:04:22 without any user edit, right after "department_changed" written by Desk. On 13 Oct the developer said a new ticket no longer runs On Edit rules when Desk fills in its department.'],
    ['New defect', 'Is Overdue is false in Create rules', 'Ticket created with a due date of yesterday: "Is Overdue = true" did not fire, "Is Overdue = false" fired. The same check in an Edit rule fires correctly.'],
    ['Observation', 'Untrusted customer replies do not fire rules', 'A reply from mmohamed@anyware.software landed on #577 as untrusted (dkim_not_aligned); it set Customer Responded but the Customer Reply rule did not run. The same reply from Gmail (trusted) fired it. Possibly intended; worth confirming with the developer. Also: a reply sent by an admin without a department mailbox (from_address empty) could not be answered — the customer reply never reached Desk.'],
    ['Observation', 'Ticket History still says "by System" for the change', 'The "Workflow rule ran" entry names the rule, but the change it made ("Comment added") is still "by System", and the action shows as a raw key (AddTicketComment).'],
    ['Observation', 'Email action needs subject and body even with a template', 'With a Desk template chosen, the API still requires emailSubject and emailBody.'],
    ['Observation', 'Automation false negatives', 'WorkflowParityGapsTest failed on capitalisation ("Add comment" vs "Add Comment") and read the condition field list before the Contact · / Account · fields loaded (48 vs 82). Tests to be updated.']] };
fs.writeFileSync(path.join(RUN, 'results.json'), JSON.stringify(R, null, 1));
// ledger.md from ledger.json
const L = JSON.parse(fs.readFileSync(path.join(RUN, 'ledger.json'), 'utf8'));
const deleted = new Set(JSON.parse(fs.existsSync(path.join(RUN, 'deleted.json')) ? fs.readFileSync(path.join(RUN, 'deleted.json'), 'utf8') : '[]'));
const closed = new Set(['7644ce9e-0fe6-44da-99f1-79f58bfb0d45', '70c80b92-d7ac-4c15-b0f6-4e76d8a9139c', '36777aa3-d84a-4c6e-8de9-95d67f397b2c']);
const keepRules = ['A1', 'QA WF A5 all ratings', 'QA WF A5 good only', 'QA WF A5 bad only', 'A5send'];
const rows = L.map(x => ['NDC-2203', x.k, x.id, 'QA WF ' + x.tag, x.k === 'rule' && !keepRules.includes(x.tag) ? 'deleted (freed the 50-rule limit)' : deleted.has(x.id) ? 'deleted' : closed.has(x.id) ? 'closed (Desk Agent cannot delete; admin has no access)' : 'pending']);
rows.push(['NDC-2203', 'automation run', '—', 'WorkflowParityGapsTest (read-only)', 'nothing to clean']);
fs.writeFileSync(path.join(RUN, 'ledger.md'), '# Test data ledger — NDC-2203 retest (26 Oct 2026)\n\n| Ticket | Kind | Id | Name / change | Cleanup |\n|---|---|---|---|---|\n' + rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n');
console.log('results.json + ledger.md:', items.length, 'items,', L.length, 'ledger rows');
