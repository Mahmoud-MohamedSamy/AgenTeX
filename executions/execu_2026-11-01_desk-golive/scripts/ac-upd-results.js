// Fix line 1 and apply the recheck rows to access/results.md (17 Nov afternoon)
const fs = require('fs'), path = require('path'); const p = path.join(__dirname, '../access/results.md');
const L = fs.readFileSync(p, 'utf8').split('\n');
L[0] = '# Ticket access run — results (17 Nov 2026, rechecked the same afternoon)';
const rows = {
  'AC-08': ['DECISION', 'peers on Manager: D/E read each other\'s tickets, edit 403, private comment 201 (TAVI help text: "read — not edit")', 'live (both agents Custom/Manager, tickets Private): peers off → 403; peers on → view 200, edit 200 (priority changed), comment 200'],
  'AC-18': ['GAP', 'Light Agent: view + private comment only; reply/edit/pick-up/move 403; cannot be owner. **But a light agent can be added to a team (201) and a ticket assigned to that team (200)**', 'live: agent 1 made Light Agent → team create with them 422 "/agents invalid"; the same call with a full agent 200'],
  'AC-19': ['PASS', 'D as view-only member of Customer Support: view 200, private comment 201; edit/status 403, pick-up 403, reply/move 403 "You can view this ticket but not change it." (NDC-3059 not reproduced)', '—'],
  'AC-22': ['PASS', 'recheck: Restricted → internal forward 201 twice, external forward 201, customer reply 403, private comment 201 (the 11:46 refusal did not come back)', 'live: Restricted ticket shows only "Forward" (Send Private Thread); an outside address is accepted in To'],
  'AC-25': ['PASS', 'B unshares R1 → C gets 403/404 at once and after 30 s', 'live: unshare → sharedDepartments []'],
  'AC-29': ['PASS', 'Department rule "Receiving a shared ticket" exists (off by default in Customer Support). Switched on: C got "Ticket #4859 shared with Customer Support: QA AC2 R2" in the bell; switched off again', 'live: Department Notifications › Receiving a shared ticket (off by default)'],
  'AC-32': ['PASS', 'spam removes the share; comment, reply and re-share refused "Mark it as Not Spam first." (NDC-3073 looks fixed)', 'live: markSpam → sharedDepartments []'],
  'AC-36': ['BLOCKED', 'no SLA attaches to Marketing tickets on staging (two QA policies; re-apply for the policy and for the ticket: state "none"), so the SLA reset on move could not be seen', '—'],
  'AC-39': ['INFO', 'C moves R5 (Standard layout) into QA NDC Manual Invoice (own layout): no layout step; the ticket keeps the shared Standard layout and the department layout is offered under Change Layout; ticket number changed to that department\'s series (#4862)', 'not compared (test org has one layout per department)'],
  'AC-43': ['PASS', 'Team Assignment off in Customer Support: assign to team 422 "Team Assignment is off…"; owner picker lists agents only; switched on again', '—'],
  'AC-44': ['PASS (same as Zoho)', 'contact page as C: only the Customer Support ticket (1); the contact\'s Marketing and shared tickets not listed or counted', 'live: contacts/{id}/tickets for agent 2 lists only TechEgySolutions tickets (shared and Tech left out)'],
  'AC-46': ['GAP', 'C follows R3; owner moves it to Sales: C keeps the follow and still gets bell items "Ticket #4860 moved to Sales" and "New comment on ticket #4860: QA AC2 R3" (subject + number) though C cannot open it', 'live: agent 2 followed Y3; after the move to Tech the followers list is empty'],
  'AC-47': ['BLOCKED', 'needs a Help Center (customer) login with a mailbox we can sign into', '—'],
  'AC-48': ['PASS', 'B exports Tickets (Setup › Export): 22 rows = the 22 records B can list; Customer Support ticket R7 not in the file', '—'],
};
for (let i = 1; i < L.length; i++) { const m = L[i].match(/^\| (\d+) \| (AC-\d+) \|/); if (m && rows[m[2]]) L[i] = `| ${m[1]} | ${m[2]} | ${rows[m[2]].join(' | ')} |`; }
fs.writeFileSync(p, L.join('\n'));
const c = {}; L.filter(l => /^\| \d+ \| AC-/.test(l)).forEach(l => { const v = l.split('|')[3].trim().split(' ')[0]; c[v] = (c[v] || 0) + 1; }); console.log(c);
