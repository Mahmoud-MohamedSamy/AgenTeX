// Writes the A1-A7 annotate specs (lane AC, 17 Nov 2026 findings retest)
const fs = require('fs'), path = require('path'); const SD = path.join(__dirname, '..', 'specs');
const W = (n, o) => fs.writeFileSync(path.join(SD, n + '.json'), JSON.stringify(o, null, 1));
const env = 'NDC-Staging · staging-desk · Edge · shared owner session';
W('A1', { out: 'A1-retest-FIXED.png', ticket: 'A1 (NDC-3095)', priority: 'low', title: 'Tickets | A ticket can now be moved from the ticket list (select › More › Move to Department)', verdict: 'FIXED', env: env + ' · ticket #5087 QA RT21 AC A1 (Customer Support → Sales) · 16:00 UTC', date: '17 Nov 2026',
  panels: [{ img: 'A1-5-bulk-more.png', caption: 'All Tickets: one ticket selected › More now offers "Move to Department"', crop: [260, 56, 1340, 330], boxes: [{ b: [276, 120, 600, 176], n: 1, kind: 'PASS' }, { b: [940, 186, 1156, 216], n: 2, kind: 'PASS' }] },
    { img: 'A1-7-move-chosen.png', caption: 'Move dialog: Sales chosen; Move → ticket is in Sales (API department_id = Sales)', crop: [544, 248, 512, 404], boxes: [{ b: [569, 446, 1031, 478], n: 3, kind: 'PASS' }, { b: [964, 603, 1031, 639], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Select a ticket in the list', 'Move offered from the list (Zoho: department label › Move Department)', 'Selection bar › More lists "Move to Department"', 'PASS'],
    [2, 'Open Move to Department', 'A department picker', 'Dialog "Move 1 ticket to another department": Department + Assign to (agents/teams of that department)', 'PASS'],
    [3, 'Move to Sales', 'Ticket moves', 'Moved: department = Sales, status Open, unassigned', 'PASS'],
    [4, 'Department on list rows', 'Zoho shows it on each row', 'Still not shown on rows (not needed to move)', 'INFO'],
    [5, 'First try 16:00 UTC', '-', '"Failed to fetch dynamically imported module MoveTicketDialog-….js" (old file 404 after a deploy); worked after reload', 'INFO']] });
W('A2', { out: 'A2-retest-STILL-FAILS.png', ticket: 'A2 (NDC-3096)', priority: 'low', title: 'Tickets | No message when another agent moves the ticket you have open', verdict: 'STILL FAILS', env: env + ' · agent C (Customer Support) signed in once · #5089 moved Customer Support → Sales by the owner at 16:03:35 UTC', date: '17 Nov 2026',
  panels: [{ img: 'A2-1-c-open-before.png', caption: 'Agent C has #5089 open (Customer Support)', crop: [664, 56, 936, 300], boxes: [{ b: [680, 70, 1040, 135], n: 1, kind: 'INFO' }] },
    { img: 'A2-2-c-after-move.png', caption: '5 s after the owner moves it to Sales: the page swaps, no who/where', crop: [664, 380, 936, 170], boxes: [{ b: [740, 425, 1180, 530], n: 2, kind: 'FAIL' }] }],
  rows: [[1, 'C has the ticket open', 'Ticket shown', 'Shown', 'INFO'],
    [2, 'Owner moves it to Sales', 'Zoho (per 17 Nov morning live check): "<agent> has moved this ticket from TechEgySolutions to Tech department. Would you like to stay on this ticket?"', '"This ticket is not available. It was deleted, or it is outside the records you are allowed to see." Same after 15 s and after reload', 'FAIL']] });
W('A3', { out: 'A3-retest-STILL-FAILS.png', ticket: 'A3 (NDC-3097)', priority: 'low', title: 'Teams | A light agent can still be added to a team, and the team can be given tickets', verdict: 'STILL FAILS', env: env + ' · Test User 1 switched to Desk Light Agent for the test, restored to Desk Supervisor · 15:58 UTC', date: '17 Nov 2026',
  panels: [{ img: 'A3-api-card.png', caption: 'Owner API', crop: [0, 0, 1600, 400], boxes: [{ b: [36, 146, 1564, 204], n: 1, kind: 'FAIL' }, { b: [36, 214, 1564, 251], n: 2, kind: 'FAIL' }, { b: [36, 261, 1564, 319], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Create team with a light agent', 'Refused (Zoho per 17 Nov morning live check: 422 "/agents" invalid)', '201: "QA RT21 AC Light Team" created with the light agent as member', 'FAIL'],
    [2, 'Assign a ticket to that team', '-', '200: #5085 team = the light agent\'s team', 'FAIL'],
    [3, 'Light agent as ticket owner (control)', 'Refused', '422 "not an active agent of the ticket\'s department"', 'PASS']] });
W('A4', { out: 'A4-retest-STILL-FAILS.png', ticket: 'A4 (NDC-3098)', priority: 'medium', title: 'Access | Ticket access still cannot be set per agent', verdict: 'STILL FAILS', env: env + ' · Setup › Agents › Test User 1 › Edit; Setup › Ticket Access · 15:52 UTC', date: '17 Nov 2026',
  panels: [{ img: 'A4-1-agent-edit.png', caption: 'Agent edit: profile, role, reporting manager, departments; no ticket access level', crop: [464, 45, 672, 640], boxes: [{ b: [489, 165, 1111, 255], n: 1, kind: 'FAIL' }] },
    { img: 'A4-2-ticket-access.png', caption: 'Ticket Access: one level for the whole tenant', crop: [292, 186, 928, 190], boxes: [{ b: [313, 265, 1199, 371], n: 2, kind: 'INFO' }] }],
  rows: [[1, 'Agent page / edit dialog', 'Per-agent choice: all department tickets / own + unassigned / own + team + unassigned (Zoho per 17 Nov morning live check)', 'No such field (Profile, Role, Reporting manager, Assign profile, Departments only)', 'FAIL'],
    [2, 'Ticket Access page', '-', 'Still only the tenant-wide Private / Public Read Only / Public Read/Write/Delete', 'INFO']] });
W('A5', { out: 'A5-retest-STILL-FAILS.png', ticket: 'A5 (NDC-3099)', priority: 'low', title: 'Tickets | A follower still gets notifications for a ticket that moved out of their department', verdict: 'STILL FAILS', env: env + ' · agent C (Customer Support only) · #5091 moved Customer Support → Sales at 16:05:28 UTC', date: '17 Nov 2026',
  panels: [{ img: 'A5-1-c-bell.png', caption: 'Agent C\'s bell after the move (C cannot open #5091)', crop: [1152, 0, 448, 500], boxes: [{ b: [1168, 260, 1590, 325], n: 2, kind: 'FAIL' }, { b: [1168, 422, 1590, 487], n: 2, kind: 'FAIL' }] },
    { img: 'A5-api-card.png', caption: 'API', crop: [0, 0, 1600, 400], boxes: [{ b: [36, 235, 1564, 272], n: 1, kind: 'FAIL' }, { b: [36, 282, 1564, 319], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Followers after the move', 'Follower removed (Zoho per 17 Nov morning live check: followers list empty)', 'C still on the followers list', 'FAIL'],
    [2, 'Notifications to C', 'None for a ticket C cannot see', '"Ticket #5091 moved to Sales: …" and "New comment on ticket #5091: …" (subject + number)', 'FAIL'],
    [3, 'C opens the ticket', 'Refused', '404 / 403 (correct)', 'PASS']] });
W('A6', { out: 'A6-retest-STILL-FAILS.png', ticket: 'A6 (NDC-3100)', priority: 'low', title: 'Agents | The agent page still shows raw text keys in "Tickets owned"', verdict: 'STILL FAILS', env: env + ' · Setup › Agents › Test User 1 › Overview · 15:50 UTC', date: '17 Nov 2026',
  panels: [{ img: 'A6-1-agent-overview.png', caption: 'Tickets owned', crop: [620, 100, 970, 220], boxes: [{ b: [640, 205, 1580, 290], n: 1, kind: 'FAIL' }] }],
  rows: [[1, 'Tickets owned labels', 'Open / On Hold / Closed', '"records.views.open …", "records.views.onHold 2", "records.views.closed 65"', 'FAIL']] });
W('A7', { out: 'A7-retest-DECISION.png', ticket: 'A7 (AC-08)', priority: 'none', title: 'Ticket Access | "Share data with peers" still lets peers read but not edit (Zoho lets them edit)', verdict: 'DECISION', env: env + ' · agents D (Test User 1) and E (Mahmoud TAVIPortal), both Manager, in Customer Support for the test · peers on Manager 16:08-16:09 UTC, then restored', date: '17 Nov 2026',
  panels: [{ img: 'A7-1-d-on-e-ticket.png', caption: 'D on E\'s #5097 with peers on: read-only banner; D\'s private comment added', crop: [664, 56, 936, 310], boxes: [{ b: [680, 147, 1584, 195], n: 2, kind: 'INFO' }, { b: [680, 262, 1584, 340], n: 3, kind: 'PASS' }] },
    { img: 'A7-api-card.png', caption: 'API as D and E', crop: [0, 0, 1600, 390], boxes: [{ b: [36, 193, 1564, 230], n: 1, kind: 'PASS' }, { b: [36, 240, 1564, 277], n: 2, kind: 'FAIL' }, { b: [36, 287, 1564, 324], n: 3, kind: 'PASS' }] }],
  rows: [[1, 'Peer views the other\'s ticket', 'Allowed', '200 (peers off: 403/404)', 'PASS'],
    [2, 'Peer edits a field', 'Zoho (per 17 Nov morning live check): allowed (200)', '403 "Permission denied."; page says "You can read this ticket but not change it"', 'DECISION'],
    [3, 'Peer adds a private comment', 'Allowed', '201', 'PASS']] });
console.log('specs written');
