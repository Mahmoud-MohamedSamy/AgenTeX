// Builds plane-draft.json (payloads, NOT posted) + plane-draft.html (preview with images). Usage: node build-plane-draft.js
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const ENV = 'Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge (headless) + API; owner ndc-staging-owner; agents Test User 1 (A1), Mahmoud Samy (A2), Dev Team 2 (A3); departments QA AS6 Dept A / Dept B, team QA AS6 Team A';
const LABEL = '5ad0a95a-678e-4485-845d-bb93c27dce36'; // Assignment Rules
const ul = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const ol = a => '<ol>' + a.map(x => `<li>${x}</li>`).join('') + '</ol>';
const bug = (o) => `<p>${o.summary}</p><p><strong>Steps</strong></p>${ol(o.steps)}<p><strong>Expected</strong></p><p>${o.expected}</p><p><strong>Actual</strong></p><p>${o.actual}</p>${o.notes ? `<p><strong>Notes</strong></p>${ul(o.notes)}` : ''}<p><strong>Environment</strong></p><p>${ENV}. Found 6–7 Nov 2026.</p><p><strong>Evidence</strong></p><p>${o.image} (attached): TAVI on the left, Zoho Desk on the right, same box numbers on both sides.</p>`;

const bugs = [
  {
    key: 'B-2', priority: 'high', image: 'B2-email-channel-off-vs-zoho.png',
    name: 'Round robin gives tickets to agents whose Email channel is off',
    summary: 'Round robin treats an agent as available when they are signed in, even if their Email channel is off. Zoho Desk assigns round-robin tickets only to agents who are online in the ticket\'s channel. Agents who are fully signed out are skipped correctly.',
    steps: [
      'Setup → Automation → Assignment Rules → Round Robin: in a department, make a Sequential round-robin rule on Ticket Create with agents A1, A2 and A3. Round Robin Preferences: "Assign to offline agents" off.',
      'Sign in as A1, A2 and A3. A2 turns their Email channel off (Chat and Phone stay on).',
      'Create 3 tickets in that department.',
      'Turn the Email channel off for all three agents and create one more ticket.',
    ],
    expected: 'A2 is skipped (History lists A2 as SKIPPED) and the tickets go to A1 and A3 only. With Email off for all three agents, the ticket waits unassigned in the backlog.',
    actual: 'A2 still gets its turn and is not shown as SKIPPED. With Email off for all three agents, the ticket is still assigned (to A1). The presence API shows these agents as <code>online: true</code> with <code>channels.email: false</code>.',
    notes: ['Re-checked on the 7 Nov build: same result.', 'An agent who signs out completely is skipped and listed as SKIPPED, so only the channel check is missing.'],
  },
  {
    key: 'B-3', priority: 'medium', image: 'B3-team-assignment-off-api-vs-zoho.png',
    name: 'Team Assignment off: the assign API still gives a ticket to a team',
    summary: 'With a department\'s Team Assignment switch off, the screens correctly allow only agents, but the assign API still accepts a team.',
    steps: [
      'Setup → Automation → Assignment Rules → Team Assignment: turn Team Assignment off for the department.',
      'Open a ticket in that department: the owner picker shows AGENTS only (correct).',
      'Call <code>POST /desk/tickets/{id}/assign</code> with <code>{"team_id": "&lt;a team of that department&gt;"}</code>.',
    ],
    expected: 'The request is refused (as new rules with a team target are refused with <code>team_assignment_off</code>). TAVI\'s own help text says "Off: only agents can be chosen."',
    actual: 'The request returns 200 and the ticket gets the team. Ticket #1189 shows Owner "QA AS6 Team A" while Team Assignment is off.',
    notes: ['Only the API is affected. On the ticket screen the owner picker shows AGENTS only when Team Assignment is off, and AGENTS + TEAMS when it is on.'],
  },
  {
    key: 'B-4', priority: 'medium', image: 'B4-new-ticket-owner-not-saved-vs-zoho.png',
    name: 'New Ticket form shows the current agent as owner but saves the ticket unassigned',
    summary: 'The New Ticket form opens with Ticket Owner filled in with the signed-in agent, but saving without touching that field does not send the owner. The ticket is saved Unassigned, or it is assigned by round robin to someone else. This appeared after the NDC-2275 fix of 6 Nov, which says a ticket created with the form\'s default owner keeps it.',
    steps: [
      'Sign in as an agent (here ndc-staging-owner) and open Tickets → New Ticket.',
      'Check Ticket Owner: it shows the signed-in agent.',
      'Fill in the required fields, leave Ticket Owner unchanged and save. (1) in a department with no assignment rules; (2) in a department with a round-robin rule on Ticket Create.',
    ],
    expected: 'The ticket is saved with the owner the form showed (the signed-in agent).',
    actual: '(1) Ticket #1200 (Dept B, no rules) is saved Unassigned. (2) Ticket #1199 goes to Dev Team 2 through round robin, although the form showed ndc-staging-owner. The create request has no <code>owner</code> field.',
    notes: ['Zoho Desk (seen 7 Nov): the Add Ticket form also pre-fills Ticket Owner with the signed-in agent. The Zoho form was not submitted.', 'Clearing Ticket Owner on purpose works correctly: round robin assigns the ticket.'],
  },
  {
    key: 'B-5', priority: 'medium', image: 'B5-holiday-list-not-attached-vs-zoho.png',
    name: 'Assignment rule "on a holiday of" never matches a holiday list that is not linked to business hours',
    summary: 'A holiday list can be saved without business hours, and the rule criteria picker offers it. But the criterion "Execution Time — on a holiday of &lt;list&gt;" ignores such a list, so its holidays are treated as working days.',
    steps: [
      'Setup → Holidays: create the list "QA AS6 HOL today" with one holiday today (7 Nov 2026) and the business hours switch off.',
      'Assignment Rules → Direct Assignment: rule "QA AS6 B08 holiday" with target 1 = Execution Time on a holiday of "QA AS6 HOL today" → A1, and target 2 = not a holiday of the same list → A2.',
      'Create a ticket matching target 1 and another matching target 2.',
      'Link the same list to a business-hours profile ("QA AS6 BH", not the default) and repeat.',
    ],
    expected: 'Today is a holiday of that list: "on a holiday" matches and "not a holiday" does not, whether or not the list is linked to business hours. Otherwise the picker should not offer lists that are not linked.',
    actual: 'With the list not linked: "on a holiday" does not match (#1229, re-run #1252 stay Unassigned), and "not a holiday" does match (#1230 → A2, re-run #1254 → A2). With the list linked to "QA AS6 BH", the same rule works: #1233 → A1, #1234 Unassigned.',
    notes: ['A list that is not linked, with a holiday on 25 Dec, behaves correctly on other days (#1231 no match, #1232 → A3).', 'Zoho Desk (seen): a holiday list can also be saved with Business Hours off. How Zoho rules treat such a list was not checked.'],
  },
];

// comments on existing items
const RES = s => `<strong>[${s}]</strong>`;
const comments = [
  {
    item: 'NDC-2275', current: 'Ready For Test', proposed: 'Done (new bugs filed separately and linked) — or Bug, your choice',
    html: `<p><strong>Retest — 7 Nov 2026: the round robin on Ticket Create fix passes.</strong> New issues found during the full test are filed as separate bugs (linked).</p><p>${ENV}<br>Method: API scripts and screen; agents kept online by a presence script.</p><p>Checked:</p>${ul([
      `Round robin on Ticket Create, API create with owner null and with no owner key → assigned by the RR rule; owner is not the creator ${RES('PASS')}`,
      `New Ticket form with Ticket Owner cleared → RR assigns the next agent ${RES('PASS')}`,
      `All agents offline at create → ticket waits Unassigned (backlog) ${RES('PASS')}`,
      `Direct rule moves a ticket to a department Unassigned → that department's RR assigns it in the same event (trigger "moved") ${RES('PASS')}`,
      `"Push new tickets into the backlog first" → Unassigned at create, assigned by the backlog run after about 50 s ${RES('PASS')}`,
      `Skill added on create → skill-based RR assigns in the same event ${RES('PASS')}`,
      `Team pool with "Exclude agents" (pool A2 + A3, A2 excluded) → 4 tickets all to A3 ${RES('PASS')}`,
      `Agent threshold counts open + On Hold tickets, not Closed ${RES('PASS')}`,
      `No notification when a rule re-runs and the owner does not change (#1272) ${RES('PASS')}`,
      `Department "new ticket" alert → each department agent notified once, creator not notified ${RES('PASS')}`,
      `Criteria: contact and account fields, "no criteria" target, during / outside business hours, holiday list linked to business hours ${RES('PASS')}`,
      `Conversion report in the Audit Log (actor "Assignment conversion report", 4 Nov 17:50 Cairo, 15 rules + 1 department) ${RES('PASS')}`,
      `Tickets created before the conversion (56) keep their owner, team and department ${RES('PASS')}`,
      `E2E: direct move → sequential RR + notifications; skill RR + assign on closure; sign-out → skip → backlog → assign backlogs ${RES('PASS')}`,
      `Holiday list not linked to business hours → "on a holiday" never matches ${RES('FAIL')} → B-5 bug`,
      `New Ticket form with the default owner left as is → saved Unassigned or assigned by RR ${RES('FAIL')} → B-4 bug (this contradicts the fix note "a ticket created with an owner keeps it, including the form's default of the current agent")`,
      `Email channel off → agent still gets RR tickets ${RES('FAIL')} → B-2 bug (also seen on 6 Nov)`,
      `Team Assignment off → assign API still accepts a team ${RES('FAIL')} → B-3 bug (screens are correct)`,
    ])}<p>To decide (not filed as bugs):</p>${ul([
      'The agent threshold counts the agent\'s open tickets in <strong>every</strong> department, not only the rule\'s department (A1: Dept A 60 + Dept B 6 = 66 counted). The help text says "Maximum number of open tickets an agent in the department can handle". How Zoho counts was not checked.',
      'Audit Log conversion entries read as if nothing changed ("type from round_robin to round_robin", "ID from f2d1… to f2d1…"), the precedence change shows raw rule ids, and the "Assignment conversion report" actor cannot be picked in the users filter.',
    ])}<p>Not run: the 30-day rule (data cannot be aged on staging); tickets arriving by email, web form or import.</p><p>Full report: executions/execu_2026-11-06_desk-assignment-skills/report.html</p>`,
  },
  {
    item: 'NDC-2752', current: 'Done', proposed: 'no change (comment only)',
    html: `<p><strong>Skills retest — 6–7 Nov 2026, as part of the full Assignment Rules test: all pass.</strong></p><p>${ENV}</p>${ul([
      `Skills, preferences and order per department; name / type required, 100 characters max, duplicate refused ${RES('PASS')}`,
      `Inactive skill is never added; agents on the skill form match the Agent Skills tab; search and filters ${RES('PASS')}`,
      `Skills added on create and on update, in list order; per-ticket Recalculate removes a stale skill ${RES('PASS')}`,
      `Ticket ⋯ menu → Assign by Skills: assigns a holder; clear messages for "no active skills" and "no holder online" ${RES('PASS')}`,
      `Limits: 10 skills per ticket, 30 active per department ${RES('PASS')}`,
      `Skill-based round robin, including in the same event as the skill being added ${RES('PASS')}`,
      `Where-used lists RR rule, workflow, agents and open tickets; skill name with HTML is shown as text ${RES('PASS')}`,
    ])}<p>Notes (not bugs, Zoho behaviour not checked):</p>${ul([
      'Assign by Skills on a ticket that already has an owner reassigns it (A1 → A2) with no warning.',
      'Deleting a skill type that skills still use now returns 409 (on 1 Nov it left the skills without a type).',
    ])}`,
  },
  {
    item: 'NDC-1978', current: 'Ready For Test', proposed: 'Done, or keep in Ready For Test until B-2..B-5 are fixed — your choice',
    html: `<p><strong>Full test — 6–7 Nov 2026 on NDC-Staging: Assignment Rules (NDC-2275) and Skills (NDC-2752).</strong></p><p>About 100 cases plus 3 end-to-end journeys: 93 pass, 4 pass with a failing part, 1 fail, 1 not run (the 30-day rule). Skills: all pass. The round robin on Ticket Create fix on NDC-2275 passes.</p><p>Open bugs from this test (linked):</p>${ul([
      'B-2 (High) Round robin gives tickets to agents whose Email channel is off',
      'B-3 (Medium) Team Assignment off: the assign API still gives a ticket to a team',
      'B-4 (Medium) New Ticket form shows the current agent as owner but saves the ticket unassigned',
      'B-5 (Medium) "On a holiday of" never matches a holiday list that is not linked to business hours',
    ])}<p>Details and the open questions are in the NDC-2275 comment of 7 Nov.</p>`,
  },
];

const out = {
  note: 'DRAFT ONLY — nothing posted. Waiting for the user\'s approval and filing fields.',
  project_id: 'efce4d84-5876-4015-b472-2efca7ad73f3',
  bugs: bugs.map(b => ({ key: b.key, name: b.name, priority: b.priority, labels: [LABEL], attach: 'screenshots/annotated/' + b.image, description_html: bug(b), relate_to: ['NDC-2275', 'NDC-1978'] })),
  comments: comments.map(c => ({ item: c.item, current_state: c.current, proposed_state: c.proposed, comment_html: c.html })),
};
fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify(out, null, 2));

const b64 = f => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots/annotated', f)).toString('base64');
const box = 'border:1px solid #ddd;border-radius:8px;padding:14px 18px;margin:14px 0;background:#fff';
let h = `<!doctype html><meta charset="utf-8"><title>Plane draft — Desk Assignment Rules + Skills</title><body style="font:14px/1.5 system-ui;max-width:1100px;margin:auto;background:#f6f7f9;padding:20px"><h1>Plane draft — Desk Assignment Rules + Skills (7 Nov 2026)</h1><p style="color:#b00"><strong>Draft only — nothing posted to Plane.</strong> Project NDC, label "Assignment Rules". Assignee, cycle, module and state for the new bugs: waiting for your answer.</p><h2>New bugs (4)</h2>`;
for (const b of out.bugs) h += `<div style="${box}"><div style="color:#666">${b.key} · priority <strong>${b.priority}</strong> · label Assignment Rules · relate to NDC-2275, NDC-1978</div><h3 style="margin:6px 0">${b.name}</h3>${b.description_html}<a href="${b64(path.basename(b.attach))}" target="_blank"><img src="${b64(path.basename(b.attach))}" style="width:100%;border:1px solid #ccc;border-radius:6px"></a></div>`;
h += '<h2>Comments on existing items (3)</h2>';
for (const c of out.comments) h += `<div style="${box}"><h3 style="margin:0">${c.item}</h3><div style="color:#666">Now: ${c.current_state} → proposed: <strong>${c.proposed_state}</strong></div>${c.comment_html}</div>`;
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), h + '</body>');
console.log('plane-draft.json + plane-draft.html', (h.length / 1024).toFixed(0) + ' KB');
