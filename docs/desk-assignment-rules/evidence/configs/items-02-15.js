// Writes the evidence configs for items 2–15. Run: node configs/items-02-15.js, then make-evidence.js on each.
const fs = require('fs');
const path = require('path');
const T = f => `../originals/tavi/${f}.png`;
const Z = f => `../originals/zoho/${f}.png`;
const DATE = '6 Oct 2026';
const CODE = 'FROM THE BUILD\'S CODE — not seen on screen';
const items = [
  {
    file: '02-move-ticket-to', id: 'Item 2 (Z2)', title: '"Move Ticket to" another department as a rule action',
    panels: [
      { side: 'TAVI', caption: 'New assignment rule → Assign to (not saved)', img: T('tavi-34-rule-editor-top'), boxes: [{ n: 1, x: 812, y: 412, w: 618, h: 240 }] },
      { side: 'Zoho', caption: 'Direct Assignment → Add target (not saved)', img: Z('zoho-03-direct-target'), boxes: [{ n: 2, x: 518, y: 116, w: 316, h: 66 }, { n: 1, x: 518, y: 360, w: 316, h: 68 }] }
    ],
    rows: [
      { n: '1', b: 'Move the ticket to another department when the rule matches', zoho: '"Move Ticket to" department picker in each target (seen)', tavi: 'Only An agent / A team / Round robin; no department move (seen)', match: 'Gap' },
      { n: '2', b: 'Which tickets the rule looks at', zoho: '"Ticket coming to" any department or one department (seen)', tavi: 'A rule belongs to one department, picked on the Rules tab (seen)', match: 'Differs' }
    ],
    notes: ['Already listed in Plane NDC-1978 (detail 2). Single-ticket Move exists in TAVI (Move ticket dialog), but rules cannot use it.']
  },
  {
    file: '03-business-hours-criteria', id: 'Item 3 (Z3)', title: 'Execution-time criteria: during / outside business hours, holiday / not a holiday',
    panels: [
      { side: 'TAVI', caption: 'New assignment rule → Criteria → Field list (list opened out for the screenshot)', img: T('tavi-30-criteria-fields-expanded'), boxes: [{ n: 1, x: 852, y: 332, w: 176, h: 400 }] },
      { side: 'Zoho', caption: 'Direct Assignment → Add target → Criteria (not saved)', img: Z('zoho-05-execution-time-operators'), boxes: [{ n: 1, x: 556, y: 266, w: 238, h: 40 }, { n: 2, x: 794, y: 356, w: 182, h: 192 }] }
    ],
    rows: [
      { n: '1', b: '"Execution Time" criterion', zoho: 'First field in the Tickets list (seen)', tavi: 'Not in the 23 fields offered (seen)', match: 'Gap' },
      { n: '2', b: 'Operators', zoho: 'during business hours of / outside business hours of / on a holiday of / not a holiday of (seen)', tavi: 'Not available', match: 'Gap' }
    ],
    notes: ['Already listed in Plane NDC-1978 (detail 3). TAVI has Business Hours and Holidays pages; the rules cannot use them.']
  },
  {
    file: '04-date-number-operators', id: 'Item 4 (Z4)', title: 'Date fields and date / number operators in rule criteria',
    panels: [
      { side: 'TAVI', caption: 'Criteria → Field list (opened out): no date field', img: T('tavi-30-criteria-fields-expanded'), boxes: [{ n: 1, x: 852, y: 332, w: 176, h: 400 }] },
      { side: 'TAVI', caption: 'Criteria → Priority → Operator list (opened out)', img: T('tavi-31-criteria-operators-expanded'), boxes: [{ n: 2, x: 1030, y: 330, w: 178, h: 98 }] },
      { side: 'Zoho', caption: 'Direct Assignment → Criteria → Due Date (not saved)', img: Z('zoho-06-date-operators'), boxes: [{ n: 1, x: 556, y: 266, w: 238, h: 40 }, { n: 2, x: 794, y: 356, w: 182, h: 230 }] }
    ],
    rows: [
      { n: '1', b: 'Date fields in criteria (Due Date, Created Time, Modified Time, Closed Time…)', zoho: 'Offered for tickets, contacts and accounts (seen)', tavi: 'None of the 23 fields is a date (seen)', match: 'Gap' },
      { n: '2', b: 'Operators', zoho: 'is, isn\'t, is after, is before, between, not between, is empty, is not empty; value can be "Current Time" (seen)', tavi: 'Text: is/isn\'t/contains/…; picklist: is/isn\'t/is any of/empty; number: only is / isn\'t / empty (code)', match: 'Gap' }
    ],
    notes: ['Already listed in Plane NDC-1978 (detail 4). TAVI number operators come from the CriteriaBuilder chunk: number = [equals, not_equal_to, is_empty, is_not_empty].']
  },
  {
    file: '05-criteria-fields', id: 'Item 5 (Z5)', title: 'Criteria on contact and account fields, and on ticket owner, team, tags and dates',
    panels: [
      { side: 'TAVI', caption: 'Criteria → Field list (opened out): 23 ticket fields', img: T('tavi-30-criteria-fields-expanded'), boxes: [{ n: 1, x: 852, y: 332, w: 176, h: 400 }] },
      { side: 'Zoho', caption: 'Criteria field search "Owner" (not saved)', img: Z('zoho-04b-criteria-owner-fields'), boxes: [{ n: 1, x: 556, y: 360, w: 238, h: 70 }, { n: 2, x: 556, y: 432, w: 238, h: 152 }] },
      { side: 'Zoho', caption: 'Criteria field search "Created Time" (not saved)', img: Z('zoho-04c-criteria-created-time'), boxes: [{ n: 3, x: 556, y: 360, w: 238, h: 226 }] }
    ],
    rows: [
      { n: '1', b: 'Ticket fields offered', zoho: '38 ticket fields incl. Ticket Owner, Team, Tags, Contact Name, Account Name, Product Name, Due Date, Is Overdue, Number of Threads (seen)', tavi: '23 ticket fields; owner, team and department are left out on purpose, lookups and dates are not offered (seen + code)', match: 'Gap' },
      { n: '2', b: 'Contact and account fields', zoho: 'CONTACTS (26 fields) and ACCOUNTS (14 fields) in the same list (seen)', tavi: 'Not available', match: 'Gap' },
      { n: '3', b: 'Same field in several modules', zoho: 'Created Time under Tickets, Contacts and Accounts (seen)', tavi: 'Not available', match: 'Gap' }
    ],
    notes: ['New gap (not in NDC-1978). Full Zoho field list: reference/zoho-live-notes.md.']
  },
  {
    file: '06-master-switch', id: 'Item 6 (Z6)', title: 'One switch to turn all direct rules, or all round-robin rules, on or off',
    panels: [
      { side: 'TAVI', caption: 'Assignment Rules → Rules (Customer Support)', img: T('tavi-10-rules-empty'), boxes: [{ n: 1, x: 284, y: 64, w: 900, h: 46 }] },
      { side: 'Zoho', caption: 'Direct Assignment list', img: Z('zoho-01-assignment-direct'), boxes: [{ n: 1, x: 274, y: 56, w: 232, h: 36 }] },
      { side: 'Zoho', caption: 'Round Robin list', img: Z('zoho-08-round-robin'), boxes: [{ n: 2, x: 274, y: 56, w: 186, h: 36 }] }
    ],
    rows: [
      { n: '1', b: 'Master switch for direct rules', zoho: '"Direct Assignment Rules" toggle (seen)', tavi: 'Only a per-rule Active switch (code: rules.toggleActive)', match: 'Gap' },
      { n: '2', b: 'Master switch for round-robin rules', zoho: '"Round Robin Rules" toggle per department (seen)', tavi: 'Not available', match: 'Gap' }
    ],
    notes: ['New gap (not in NDC-1978). Small: an admin can still deactivate rules one by one.']
  },
  {
    file: '07-exclude-agents', id: 'Item 7 (Z7)', title: 'Exclude chosen agents when round robin uses a team\'s members',
    panels: [
      { side: 'TAVI', caption: 'New assignment rule → Round robin → Pool: A team\'s members (not saved)', img: T('tavi-32-rr-team-pool'), boxes: [{ n: 1, x: 822, y: 680, w: 598, h: 110 }] },
      { side: 'Zoho', caption: 'Round Robin → Assign Ticket to Teams', text: [
        'Round-robin target "Assign Ticket to: Team" has an "Exclude agents from this assignment" option to leave chosen team members out.',
        'Not seen live: the Zoho trial org has no team, so the option could not be opened.'],
        sources: ['https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-in-round-robin-order'] }
    ],
    rows: [
      { n: '1', b: 'Leave chosen team members out of a team round robin', zoho: '"Exclude agents from this assignment" (docs)', tavi: 'Only "Select a team"; no exclude list (seen)', match: 'Gap' }
    ],
    notes: ['Already listed in Plane NDC-1978 (detail 5).']
  },
  {
    file: '08-online-agents-only', id: 'Item 8 (Z8)', title: 'Round robin only to online agents, with an "Assign tickets to offline agents" switch',
    panels: [
      { side: 'TAVI', caption: 'New assignment rule → Round robin options (not saved)', img: T('tavi-33-rr-capacity-backlog'), boxes: [{ n: 1, x: 822, y: 284, w: 598, h: 534 }] },
      { side: 'Zoho', caption: 'Round Robin → ⋯ → Preferences (closed with Cancel)', img: Z('zoho-13-rr-preferences'), boxes: [{ n: 1, x: 334, y: 58, w: 772, h: 76 }] }
    ],
    rows: [
      { n: '1', b: 'Who round robin can pick', zoho: 'By default only agents online on the email channel; switch "Assign tickets to offline agents" (seen)', tavi: 'No availability option. Hints mention only fixed order, fewest active tickets and skills (seen). Whether the server skips offline agents could not be checked', match: 'Gap' }
    ],
    notes: ['New gap. Related to Plane NDC-1976 "Agent online / offline status" (its example: round robin skips Sara while she is offline). TAVI already has agent availability (Ticket Access → Agent availability, idle timeout).']
  },
  {
    file: '09-thresholds', id: 'Item 9 (Z9)', title: 'Department-wide ticket limit and per-agent limit',
    panels: [
      { side: 'TAVI', caption: 'New assignment rule → Capacity per agent (not saved)', img: T('tavi-33-rr-capacity-backlog'), boxes: [{ n: 1, x: 828, y: 654, w: 584, h: 82 }] },
      { side: 'TAVI', caption: 'Team Assignment → Load-based (not saved)', img: T('tavi-18-team-assignment-load'), boxes: [] },
      { side: 'Zoho', caption: 'Round Robin Preferences', img: Z('zoho-13-rr-preferences'), boxes: [{ n: 2, x: 334, y: 146, w: 772, h: 120 }, { n: 3, x: 334, y: 278, w: 772, h: 76 }] }
    ],
    rows: [
      { n: '1', b: 'Where the limit is set', zoho: 'Once per department, used by every round-robin rule (seen)', tavi: '"Capacity per agent" on each rule and on Team Assignment, 1–1000 (seen)', match: 'Differs' },
      { n: '2', b: 'Department wise threshold', zoho: 'On by default, 40 open tickets in this org (seen); docs range 1–200', tavi: 'Not available', match: 'Gap' },
      { n: '3', b: 'Agent level threshold that overrides the department value', zoho: 'Switch + per-agent value (seen)', tavi: 'Not available — the same limit applies to every agent of a rule', match: 'Gap' }
    ],
    notes: ['New gap.']
  },
  {
    file: '10-backlog-options', id: 'Item 10 (Z10)', title: 'Backlog options: on/off per department, how many and in which order',
    panels: [
      { side: 'TAVI', caption: 'Assignment Rules → Backlog', img: T('tavi-04-backlog'), boxes: [{ n: 1, x: 286, y: 184, w: 680, h: 42 }] },
      { side: 'TAVI', caption: 'New assignment rule → Keep excess tickets in backlog', img: T('tavi-33-rr-capacity-backlog'), boxes: [{ n: 2, x: 828, y: 744, w: 584, h: 60 }] },
      { side: 'Zoho', caption: 'Round Robin Preferences → Assign backlogs', img: Z('zoho-13-rr-preferences'), boxes: [{ n: 2, x: 334, y: 438, w: 772, h: 62 }] }
    ],
    rows: [
      { n: '1', b: 'Order and timing', zoho: 'Order by Due Date or Created Time; limit 1–50 per run (docs)', tavi: '"First come, first served every minute and whenever an agent frees up" (seen)', match: 'Gap' },
      { n: '2', b: 'Where it is switched on', zoho: '"Assign backlogs" once per department (seen)', tavi: 'Per rule ("Keep excess tickets in backlog") and per Team Assignment (seen)', match: 'Differs' }
    ],
    notes: ['New gap, small. TAVI extra: a Backlog page listing the waiting tickets, the reason and the attempts, with "Process now".',
            'Zoho also has "Assign tickets on closure" (next unassigned ticket goes to the agent who closed one); TAVI\'s backlog does this for backlog tickets only.']
  },
  {
    file: '11-skills', id: 'Item 11 (Z11)', title: 'Skills management: skill types, skills with criteria stamped on tickets, agents per skill',
    panels: [
      { side: 'TAVI', caption: 'Assignment Rules → Agent Skills', img: T('tavi-03-agent-skills'), boxes: [{ n: 1, x: 286, y: 182, w: 660, h: 46 }, { n: 3, x: 292, y: 290, w: 1124, h: 214 }] },
      { side: 'Zoho', caption: 'Setup → Skills', img: Z('zoho-14-skills'), boxes: [{ n: 1, x: 274, y: 100, w: 140, h: 32 }] },
      { side: 'Zoho', caption: 'Setup → Skills → Add Skill (closed with Cancel)', img: Z('zoho-15-add-skill'), boxes: [{ n: 1, x: 754, y: 134, w: 356, h: 60 }, { n: 2, x: 274, y: 296, w: 800, h: 98 }, { n: 3, x: 274, y: 424, w: 836, h: 100 }] }
    ],
    rows: [
      { n: '1', b: 'Skill types and skills', zoho: 'Skills and Skill Types tabs; Skill Type is required (seen)', tavi: 'Skills are the options of the Tickets "Skills" picklist field (seen)', match: 'Gap' },
      { n: '2', b: 'Skill added to tickets automatically', zoho: 'Each skill has criteria; matching tickets get the skill (seen); recalculate via API (docs)', tavi: 'The agent picks skills by hand on the ticket (seen on New Ticket)', match: 'Gap' },
      { n: '3', b: 'Link agents and skills', zoho: 'Agents chosen inside the skill (seen)', tavi: 'Tick skills per agent (seen)', match: 'Same as Zoho' }
    ],
    notes: ['Already listed in Plane NDC-1978 (detail 6). Zoho also has Skill Preferences (auto-add on/off, position) and up to 10 skills per ticket (docs).']
  },
  {
    file: '12-workflow-assign-team', id: 'Item 12 (Z12)', title: 'Workflow action that assigns a ticket to a team or to an agent in a team',
    panels: [
      { side: 'TAVI', caption: 'Workflow Rules → action "Owner Assignment"', flag: CODE, text: [
        'Action "Owner Assignment" — "Sets the record\'s owner when the rule fires."',
        'Targets in the code: SpecificUser, UserField, Role, RoleRoundRobin ("The users in the role will be assigned in a round-robin pattern").',
        'No team target and no "agent in a team" target.'], sources: ['crm-workflow locale (owner.*, actionType.OwnerAssignment); chunk pages-*.js'] },
      { side: 'Zoho', caption: 'Workflows → Rules → Actions → Assign', text: [
        'Workflow rules can assign the ticket to an Agent, a Team, or an Agent in a Team, and can add or remove skills.'],
        sources: ['https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/assigning-tickets-using-workflows-assignment-rule'] }
    ],
    noShot: {},
    rows: [
      { n: '1', b: 'Assign to a team from a workflow', zoho: 'Yes (docs)', tavi: 'No (code)', match: 'Gap' },
      { n: '2', b: 'Assign to an agent inside a team', zoho: 'Yes (docs)', tavi: 'No (code)', match: 'Gap' },
      { n: '3', b: 'Round robin inside a workflow action', zoho: 'No; done by round-robin rules (docs)', tavi: 'Round robin over a role (code)', match: 'TAVI extra' }
    ],
    notes: ['New gap. The TAVI workflow builder was not opened past its first dialog because "Next" may save a draft rule.']
  },
  {
    file: '13-ai-owner-prediction', id: 'Item 13 (Z13)', title: 'AI suggestion of the ticket owner (Zia Field Predictions)',
    panels: [
      { side: 'TAVI', caption: 'Setup → Automation', flag: CODE, text: [
        'Automation menu: Workflow Rules, Actions, SLA & Escalation, Support Plans, Assignment Rules, Macros, AI Tagging, Ticket Archiving (seen in the setup menu).',
        'No owner prediction anywhere in the Desk strings; AI Tagging suggests tags only.'], sources: ['desk locale, setup menu text'] },
      { side: 'Zoho', caption: 'Setup → Zia → Field Predictions', text: [
        'Zia predicts the Ticket Owner (and other fields) from past tickets, with an accuracy score. It runs when a ticket is created or a customer replies, and can update the field or wait for an agent to confirm.',
        '"Field Predictions" is in the Zia section of Setup (seen in the setup menu). Professional and Enterprise.'],
        sources: ['https://help.zoho.com/portal/en/kb/desk/automation/assignment-rules-notification/articles/automatic-triaging-and-assignment-of-tickets'] }
    ],
    rows: [
      { n: '1', b: 'Predict who should own a ticket', zoho: 'Zia Field Predictions on Ticket Owner (docs; menu seen)', tavi: 'Not available', match: 'Gap' }
    ],
    notes: ['New gap. Check with the PRD owner whether AI triage is in scope.']
  },
  {
    file: '14-notification-rules', id: 'Item 14 (Z14)', title: 'Assignment notifications per department, per channel, with editable templates',
    panels: [
      { side: 'TAVI', caption: 'Assignment Rules → Notifications', img: T('tavi-05-notifications'), boxes: [{ n: 1, x: 292, y: 186, w: 672, h: 174 }, { n: 2, x: 292, y: 378, w: 672, h: 70 }] },
      { side: 'Zoho', caption: 'Setup → Notifications → Notification Rules (nothing changed)', img: Z('zoho-17-notify-assigning-ticket'), boxes: [{ n: 3, x: 428, y: 60, w: 134, h: 26 }, { n: 2, x: 676, y: 136, w: 146, h: 40 }, { n: 1, x: 276, y: 540, w: 560, h: 80 }] }
    ],
    rows: [
      { n: '1', b: '"Assigning a ticket" to agent / to team', zoho: 'Agent and Team notification rules (seen)', tavi: 'Two switches (seen)', match: 'Same as Zoho' },
      { n: '2', b: 'Channel per notification', zoho: 'Email and mobile/SMS switches per rule (seen)', tavi: '"Channels follow your organization\'s notification policy and each user\'s own settings" (seen)', match: 'Differs' },
      { n: '3', b: 'Per department', zoho: 'Department picker at the top (seen)', tavi: 'One setting for the whole organisation', match: 'Gap' },
      { n: '4', b: 'Editable email template', zoho: 'Template per rule and department (docs)', tavi: 'Not available', match: 'Gap' },
      { n: '5', b: 'Alert the department when a new ticket is not auto-assigned', zoho: 'Department Notifications → "Creating a new ticket" (seen)', tavi: 'Not available', match: 'Gap' }
    ],
    notes: ['New gap.']
  },
  {
    file: '15-api', id: 'Item 15 (Z15)', title: 'Assignment API coverage',
    panels: [
      { side: 'TAVI', caption: 'Live API, GET only, 6 Oct 2026', flag: 'FROM THE LIVE API — not a screen', text: [
        'Exists: /desk/assignment-rules (list per department, create, update, delete, PUT /order), /desk/departments/{id}/team-assignment, /desk/agent-skills, /desk/agents/{id}/skills, /desk/assignment-backlog (+ /process), /desk/assignment/notification-settings.',
        'GET /desk/assignment-rules/{id} → 405 (no read of one rule).',
        '404: /desk/routing-preferences, /desk/round-robin, /desk/skills, /desk/skill-types, /desk/agents/online, /desk/agents/availability, /desk/agents/tickets-count.'], sources: ['reference/tavi-baseline-2026-10-06.json (probes)'] },
      { side: 'Zoho', caption: 'Zoho Desk API', text: [
        'Direct assignment rules: list, get, create, update, reorder, on/off.',
        'Round robin preferences (/routingPreferences), skills, skill types, skill configuration, agent–skill mapping, executeSkillbasedAssignment, recalculateSkills.',
        'Agent availability (onlineAgents, offlineAgents, agentAvailability) and agentsTicketsCount.'],
        sources: ['https://desk.zoho.com/DeskAPIDocument'] }
    ],
    rows: [
      { n: '1', b: 'Read one rule', zoho: 'Yes (docs)', tavi: '405', match: 'Gap' },
      { n: '2', b: 'Round-robin preferences, skill types, skills with criteria', zoho: 'Yes (docs)', tavi: '404', match: 'Gap' },
      { n: '3', b: 'Online / offline agents and ticket count per agent', zoho: 'Yes (docs)', tavi: '404', match: 'Gap' }
    ],
    notes: ['New gap. These follow from items 8, 9 and 11.']
  }
];
for (const it of items) {
  const cfg = { out: `../${it.file}-vs-zoho.png`, date: DATE, id: it.id, title: it.title, verdict: 'Gap', panels: it.panels, rows: it.rows,
    notes: [...it.notes, ...(it.panels.some(p => p.img) ? ['Originals: ' + it.panels.filter(p => p.img).map(p => p.img.replace('../', '')).join(', ')] : [])] };
  fs.writeFileSync(path.join(__dirname, it.file + '.json'), JSON.stringify(cfg, null, 2));
}
console.log('wrote', items.length);
