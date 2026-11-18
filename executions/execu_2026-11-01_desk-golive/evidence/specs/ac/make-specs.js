// Writes the annotated-evidence specs for AC-G3, AC-G5, AC-G6, AC-08, AC-B1 and renders them (17 Nov access run)
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const D = __dirname; const A = path.join(D, '../../../scripts/annotate-vs-zoho.js');
const ENV = 'TAVI: staging-desk.taviportal.com, NDC-Staging · Zoho Desk: test org TechEgySolutions (admin, test agents 1 and 2) · Edge · test data deleted and settings restored after';
const card = (img, caption, boxes, hh) => ({ img, w: 900, h: 560, crop: [0, 0, 900, hh || 460], caption, boxes });
const specs = {
  'AC-G3-light-agent-team': { ticket: 'AC-G3', verdict: 'GAP', label: 'GAP · Low', title: 'Teams | A light agent can be added to a team, and the team can then be given tickets',
    panels: [card('acard/g3-tavi.png', 'TAVI · light agent added to "QA AC Light Team", ticket assigned to that team', [{ b: [36, 296, 864, 532], n: 1 }], 545),
             card('acard/g3-zoho.png', 'Zoho · same team call: light agent refused, full agent accepted', [{ b: [36, 186, 864, 354], n: 1 }], 370)],
    rows: [[1, 'Team with a light agent as member', 'Refused: 422 "/agents" invalid. The same call with a full agent returns 200.', 'Accepted: team created (201) with the light agent as member, and a ticket assigned to the team (200). Making the light agent the ticket owner is refused (correct).', 'DIFFERS']] },
  'AC-G5-per-agent-access': { ticket: 'AC-G5', verdict: 'GAP', label: 'GAP · Medium', title: 'Access | Ticket access cannot be set per agent (all department tickets / own + unassigned / own + team + unassigned)',
    panels: [{ img: 'access/ta-publicRO.png', w: 1280, h: 720, crop: [292, 190, 608, 260], caption: 'TAVI · Setup › Ticket Access: one level for the whole tenant', boxes: [{ b: [313, 265, 880, 432], n: 1 }] },
             card('acard/g5-zoho.png', 'Zoho · agent 2 alone switched to "AgentPersonal"', [{ b: [36, 186, 864, 380], n: 1 }], 460)],
    rows: [[1, 'Limit one agent to own + unassigned tickets', 'Per agent (Role and Permission): agent 2 switched to AgentPersonal gets 403 on agent 1\'s ticket; switched back, 200. Other agents unchanged.', 'Only a tenant-wide level (Private / Public Read Only / Public) plus roles. One agent cannot be limited while the others keep seeing the whole department.', 'DIFFERS']] },
  'AC-G6-follower-after-move': { ticket: 'AC-G6', verdict: 'GAP', label: 'GAP · Low', title: 'Tickets | A follower keeps getting notifications for a ticket that moved out of their department',
    panels: [{ img: 'access/c-bell-r3.png', w: 1280, h: 720, crop: [832, 0, 448, 300], caption: 'TAVI · agent C\'s bell after #4860 moved to Sales (C cannot open it)', boxes: [{ b: [848, 172, 1270, 286], n: 1 }] },
             card('acard/g6-zoho.png', 'Zoho · followers list before and after the move', [{ b: [36, 301, 864, 359], n: 1 }], 370)],
    rows: [[1, 'Follower who cannot see the new department', 'Removed from the followers list when the ticket moves; no more updates.', 'Stays a follower (GET followers → [C]); gets "Ticket #4860 moved to Sales" and "New comment on ticket #4860: QA AC2 R3" (subject and number), while the ticket itself answers 403/404 for C.', 'DIFFERS']] },
  'AC-08-peers-edit': { ticket: 'AC-08', verdict: 'DECISION', label: 'DECISION', title: 'Ticket Access | "Share data with peers" lets peers read but not edit (Zoho lets them edit)',
    panels: [card('acard/d08-tavi.png', 'TAVI · peers on role Manager: D on E\'s ticket', [{ b: [36, 186, 864, 244], n: 1 }, { b: [36, 369, 864, 448], n: 2 }], 460),
             card('acard/d08-zoho.png', 'Zoho · peers on role Manager: agent 2 on agent 1\'s ticket', [{ b: [36, 254, 864, 406], n: 1 }], 420)],
    rows: [[1, 'Peer edits a field', 'Allowed: priority changed (200); view and comment 200. With peers off: 403.', 'Refused: 403 "Permission denied."; view 200 and private comment 201.', 'DIFFERS'],
           [2, 'Intended?', '-', 'TAVI\'s Ticket Access page says peers "can read — not edit". Keep this design or match Zoho?', 'INFO']] },
  'AC-B1-agent-raw-keys': { ticket: 'AC-B1', verdict: 'BUG', label: 'BUG · Low', title: 'Agents | The agent page shows raw text keys in "Tickets owned"',
    panels: [{ img: 's6-agent.png', w: 1280, h: 720, crop: [620, 100, 650, 220], caption: 'TAVI · Setup › Agents › Test User 1 › Overview', boxes: [{ b: [640, 205, 1252, 290], n: 1 }] }],
    rows: [[1, 'Tickets owned labels', 'Not compared: TAVI-only bug (untranslated text).', 'Shows "records.views.open 93", "records.views.onHold 2", "records.views.closed 51" instead of Open / On Hold / Closed.', 'BUG']] },
};
for (const [name, s] of Object.entries(specs)) { const f = path.join(D, name + '.json'); fs.writeFileSync(f, JSON.stringify({ out: name + (s.panels.length > 1 ? '-vs-zoho' : '') + '.png', date: '17 Nov 2026' + (s.panels.length > 1 ? ' (TAVI and Zoho live)' : ''), env: s.panels.length > 1 ? ENV : 'TAVI: staging-desk.taviportal.com, NDC-Staging, owner · Edge', ...s }, null, 1)); console.log(execFileSync('node', [A, f]).toString().trim()); }
