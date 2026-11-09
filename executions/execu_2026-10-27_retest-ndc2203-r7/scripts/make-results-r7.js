// Writes results.json (NDC-2203 retest round 7, 27 Oct 2026) and ledger.md (from ledger.json) for make-report-html.js.
// Usage: node scripts/make-results-r7.js [A1 verdict PASS|FAIL]
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const P = 'PASS', F = 'FAIL', I = 'INFO';
const A1 = process.argv[2] || 'PENDING';
// [#, item, expected, how checked, now, result, label for INFO]
const items = [
  ['A1', 'Customer Reply trigger', 'Rule fires when the customer replies', 'Ticket #648 with the contact = QA Gmail; agent reply sent; customer replies from Gmail', A1 === 'PASS' ? 'Fired on the reply from the QA Gmail' : A1 === 'FAIL' ? 'Reply landed, rule did not fire' : 'Waiting for the reply from the QA Gmail (agent reply sent 12:01 UTC)', A1 === 'PENDING' ? I : A1, 'Waiting'],
  ['A2', 'Agent Response trigger', 'Rule fires on an agent reply', 'Agent reply on a QA ticket', 'Fired', P],
  ['A3', 'Comment trigger (public only)', 'Public comment fires, private does not', 'Private comment, then public comment', 'Private: not fired. Public: fired', P],
  ['A4', 'Private Thread: incoming / outgoing / both (FIXED)', 'Choose incoming, outgoing or both', 'Editor options; 3 rules on #592; forward to a Gmail address that is not the contact; answer from that address', 'Editor: Incoming and outgoing / Incoming / Outgoing. Forward → Outgoing + Both fired, Incoming not. Answer → filed private (private_thread_answer), Incoming + Both fired, Outgoing not; ticket stays Open, Customer Responded not set', P],
  ['A5', 'Happiness Rating trigger', 'All / good / okay / bad', 'Developer: needs Customer Happiness on', 'Customer Happiness still disabled on staging (not changed)', I, 'Not testable'],
  ['B1', 'Add Comment (public / private)', 'Comment added', 'Create rules', 'Both added; History "by workflow rule QA WF B01a/B01b"', P],
  ['B2', 'Send Email Reply', 'Reply emailed', 'Create rule', 'sent_to = contact; "Reply sent by workflow rule QA WF B02"', P],
  ['B3', 'Reply via Instant Messaging', 'Offered / works', 'Developer: needs a WhatsApp brand', 'Not configured on staging', I, 'Not testable'],
  ['B4', 'Notify via Instant Messaging', 'Offered / works', 'Same', 'Not configured on staging', I, 'Not testable'],
  ['B5', 'Add Followers', 'Follower added', 'Create rule', 'followers = [me]', P],
  ['B6', 'Mark as Spam', 'Ticket marked spam', 'Create rule', 'is_spam true; "Marked as spam by workflow rule QA WF B06"', P],
  ['B7', 'Share Ticket', 'Shared with a department', 'Create rule, HR read-only', 'Shared with HR; "by workflow rule QA WF B07"', P],
  ['B8', 'Change Layout', 'Layout changed', 'Create rule → QA WF Layout', 'changed true; "by workflow rule QA WF B08"', P],
  ['B9', 'Custom Functions → Run Custom Action', 'Offered / runs', 'Developer: NDC-1989', 'Not re-run: no custom action or API source exists on staging now (round 5 source deleted)', I, 'Not re-run'],
  ['B10', 'Cliq → Slack / Teams / Google Chat', 'Offered', 'Developer: needs a connected chat service', 'None connected (not changed)', I, 'Not testable'],
  ['B11', 'Add Skills', 'Skills added', 'Create rule', 'skills = [tier_1_support] (History still "by System" — developer\'s known limit)', P],
  ['B12', 'Remove Skills', 'Skills removed', 'Create rule', 'skills = [tier_2_support]', P],
  ['B13', 'Recalculate Skills', 'Skills recalculated', 'Create rule', 'Succeeded, changed false (no skill has criteria)', I, 'Limited'],
  ['B14', 'Reassign based on Skills', 'Owner = skilled agent', 'Create rule', 'Succeeded, reassigned false, nobody_online', I, 'Limited'],
  ['D1', 'Assign to a team — Create rule (FIXED)', 'Ticket goes to the team, owner cleared', 'Create rule; tickets by API (#605), New Ticket form (#616, #617), Desk Agent with owner = self (#618); read as the agent', 'All: team = Customer Experience Specialists, owner null at create; #618 then auto-assigned by the team round robin ("sequence")', P],
  ['D1', 'Assign to a team — Edit rule', 'Unchanged', 'Edit rule on #650', 'Owner cleared, team set', P],
  ['D2', 'Email alerts / Desk template without subject and body (FIXED)', 'Saves and sends with the template', 'QA Desk template; rule + saved action without subject/body; Team and Role recipients', '201; contact_emailed true, agents_emailed 1 (#612, #615); Team/Role accepted; no template → subject + body still required (400)', P],
  ['D3', 'Field Changed: up to 3 fields', '3 allowed', 'Rule with 4 fields', '"watches at most 3 fields"', P],
  ['D4', 'Field Changed: All / Any', 'All / Any', 'Any: 1 field. All: 2 of 3, then 3 of 3 in one save', 'Any fired; All not on 2 of 3, fired on 3 of 3', P],
  ['E1', 'Contact and Account fields', 'Conditions match', 'Contact · Title and Account · Account Name with Y/N tickets', 'Only the matching tickets fired', P],
  ['E2', 'Execution Time', 'Business hours / outside / holiday', 'Three rules (24/7 tenant)', 'business_hours fired; the other two not', P],
  ['E3', 'Missing ticket fields + Is Overdue in Create rules (FIXED)', 'Fields offered; Is Overdue true for a past due date', 'Picker; Is Overdue = true / = false rules with due yesterday and +5 days', '82 fields, all 24 listed offered; true fired for yesterday, false for +5 days', P],
  ['E4', '"doesn\'t contain"', 'Works', 'Y/N tickets', 'As expected', P],
  ['E5', '"between" / "not between"', 'Works', 'Y/N tickets', 'As expected', P],
  ['E6', '"Current Time" as a value', 'Works', 'Y/N tickets', 'As expected', P],
  ['F1', 'Saved actions', 'Reusable', 'Saved Add comment + saved Email (template) used by rules', 'Both ran', P],
  ['F2', 'Department-scoped rules', 'Runs only in its departments', 'HR-only rule', 'HR fired, Customer Support not', P],
  ['F3', 'Active / Inactive tabs', 'Tabs filter', 'Deactivated QA WF A2', 'All 32 / Active 31 / Inactive 1 (only A2)', P],
  ['F4', 'Ticket History names the rule (FIXED)', '"by workflow rule <name>", action names as words, EN + AR', 'History of #598, #594, #597 in English and Arabic', '"by workflow rule QA WF B07", "Workflow rule ran · Actions Share ticket"; AR "بواسطة قاعدة سير العمل QA WF B07", "مشاركة التذكرة"', P],
  ['—', 'On Edit rule on a new ticket (developer: not a bug)', 'No fire without an edit', 'New ticket, wait 20 s, then a real edit', 'Not fired on create; fired on the edit — claim holds', P]];
const n = k => items.filter(r => r[5] === k).length;
const v = A1 === 'FAIL' ? 'PARTIAL' : A1 === 'PASS' ? 'PASS' : 'PASS';
const R = { batch: 'Desk', title: 'Retest — Mahmoud Mohamed · NDC-2203 round 7 (Desk Workflow Rules)', date: '27 Oct 2026',
  env: 'staging-desk.taviportal.com · tenant NDC-Staging · Edge headless + API · mahmoud.mahamed1515 (Desk Administrator); fedelav803 (Desk Agent) to read team tickets',
  devNote: `Developer (27 Oct 10:22 UTC): fixed A4, D1 (Create rule), Is Overdue in Create rules, History "by workflow rule", email with a Desk template; D1e and untrusted replies not bugs; A5/B3/B4/B10/B13/B14 not testable. Result: ${n(P)} pass, ${n(F)} fail, ${n(I)} not testable / limited / waiting, of ${items.length} rows.`,
  tickets: [{ id: 'NDC-2203', uuid: '2f7deb90-a42b-43ea-b910-41b4cb4d8114', pri: 'Urgent', mod: 'Desk', feat: 'Workflow Rules', title: 'DESK Workflow Missings', v,
    dev: 'Fixes for the 26 Oct retest live on staging-desk 27 Oct 10:17 UTC: A4 Private Thread direction, D1 team on Create, Is Overdue in Create rules, History "by workflow rule <name>" (EN/AR), Desk email template without subject/body. Not a bug: On Edit on a new ticket; untrusted replies. Not testable: A5, B3, B4, B10, B13, B14.',
    devHeld: 'Yes. All five fixes work on staging; the On Edit explanation holds; the not-testable list matches staging setup.',
    summary: `All five fixes pass and the round 5 passes still pass (${n(P)} rows PASS). ${A1 === 'PENDING' ? 'A1 Customer Reply is waiting for the reply from the QA Gmail. ' : ''}Two new problems found outside the ticket's list (see observations): a false "Permission denied." when a rule moves the saved ticket to a team, and gaps in Ticket History.`,
    still: A1 === 'FAIL' ? ['A1 Customer Reply: the reply landed but the rule did not fire.'] : [],
    items, img: ['NDC-2203-retest-r7.png'] }],
  observations: [
    ['New defect', 'False "Permission denied." when a rule moves the ticket to a team', 'Creating (New Ticket form, API) or editing a ticket that an Owner Assignment › Team rule moves to a team the saver is not in answers 403 "Permission denied." (toast; the form stays open), although the ticket IS created (#616, #617, #605) / the edit IS saved (#650). Users will submit again → duplicates. Expected: saved message, then e.g. "You no longer have access to this ticket".'],
    ['New defect', '"Workflow rule ran" row missing for some rules', 'Rules whose condition uses Execution Time or Is Overdue (QA WF E2in, E3od, E3odT, E3odF) run (comment added "by workflow rule …", Execution History has the run) but no "Workflow rule ran" row is written. Rules on Contact / Created By / description have the row.'],
    ['Observation', 'History shows a raw department id', '"Department changed · New 7e1ac409-58b0-41ab-97e1-0e7d5c8c5158 · by System" instead of "Customer Support" (EN and AR).'],
    ['Observation', 'Developer\'s known limit', 'Add / Remove / Recalculate Skills still show "by System" in History (rule named on the "Workflow rule ran" row).'],
    ['Observation', 'API changes since round 5 (for automation)', 'Comment body field is body_html (content_html → 400); Language values are words (arabic, not ar); Private Thread key ticketEvents.privateThreads any|incoming|outgoing; deactivate = POST /workflow/rules/{id}/deactivate.'],
    ['Round 6', 'Cleanup', 'All round-6 test data deleted/restored and verified at 0 (ledger in execu_2026-10-26_retest-mahmoudmohamed-r6/ledger.md); Deals list prefs back to list view (v7). Not done: purge of my 20 QA items in the CRM recycle bin — refused by the safety check (ids in r6 bin-qa-items.json); 2 items owned by ndc-staging-owner left alone.'],
    ['Round 6', 'Plane', '44 Done, 3 Bug (NDC-2412, 2414, 2419), new bug NDC-2653 (Deals custom field "pipeline").'],
    ['Reminder', 'Shared setup', 'Test user 2 is still on profile Manager (switch back to "test"); revoke the Plane token and delete secret-key-1792931401453.csv; 2 leftover sign-in files from the round 5 session in scratchpad 78e9ef04.']] };
fs.writeFileSync(path.join(RUN, 'results.json'), JSON.stringify(R, null, 1));
const L = JSON.parse(fs.readFileSync(path.join(RUN, 'ledger.json'), 'utf8'));
const deleted = new Set(JSON.parse(fs.existsSync(path.join(RUN, 'deleted.json')) ? fs.readFileSync(path.join(RUN, 'deleted.json'), 'utf8') : '[]'));
const rows = L.map(x => ['NDC-2203', x.k, x.id, 'QA WF ' + x.tag, deleted.has(x.id) ? 'deleted' : 'pending (cleanup after Gate 2)']);
rows.push(['NDC-2203', 'agent tickets', '#618, #650 and the team tickets', 'created/read as fedelav803', 'pending']);
rows.push(['NDC-2203', 'language', '—', 'UI switched to Arabic for F4', 'restored to English']);
fs.writeFileSync(path.join(RUN, 'ledger.md'), '# Test data ledger — NDC-2203 retest round 7 (27 Oct 2026)\n\n| Ticket | Kind | Id | Name / change | Cleanup |\n|---|---|---|---|---|\n' + rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n');
console.log('results.json + ledger.md:', items.length, 'items,', L.length, 'ledger rows');
