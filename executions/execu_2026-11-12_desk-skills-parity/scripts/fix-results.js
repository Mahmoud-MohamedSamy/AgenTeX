const fs = require('fs'); const f = __dirname + '/../RESULTS.md'; let t = fs.readFileSync(f, 'utf8');
const rows = {
 'SK-B06': ['HTML characters in a skill name', 'refused ("does not match the allowed values")', 'accepted and shown as plain text (escaped, safe)', 'TAVI extra'],
 'SK-H05': ['Assign by skills on one ticket', 'executeSkillbasedAssignment assigns when an agent has any one of the ticket skills', 'POST /skills/assign: "No agent of the department holds every skill on the ticket" for [S3,S1]', 'Differs (bug)'],
 'SK-H06': ['Department threshold blocks skill RR', 'yes (Fathy at 5 open, threshold 3, was skipped)', 'not re-run here (thresholds covered by the NDC-2824 run)', 'Not compared'],
 'SK-J01': ['Skills as a ticket layout field', 'YES: standard field Skills (Lookup, entitySkills), Ticket Information, removable, not mandatory', 'YES: multi-select skills, Ticket Information, deletable', 'Same'],
 'SK-J02': ['Skills on the create form', 'not on Add Ticket', 'shown on Create Ticket', 'Differs (bug)'],
 'SK-J03': ['Skills on the ticket page', 'Ticket Properties › Ticket Information (chips, editable)', 'Ticket Properties › Ticket Information + a side-rail Skills tab', 'Same'],
 'SK-G10': ['Recalculate many tickets', 'no bulk action seen (per ticket / workflow action)', 'Skills page Recalculate skills: every open unowned ticket in ALL departments (96), progress + last run', 'TAVI extra'],
 'SK-D04': ['Where a skill is used', 'relatedRules (rules only)', "usage: assignment rules, workflow rules/actions, other skills' criteria, agents, open tickets (no approval processes, NDC-2805)", 'TAVI extra'],
 'SK-A02': ['Skills list page', 'Name, Skill Type, Agents, Status; filters; Add Skill; Skill Preferences', 'same, plus Active skills n of 30, Recalculate, Agent Skills tab', 'Same'],
 'SK-F01': ["Agents on a skill ↔ an agent's skills", 'skill agentIds; unconfirmed agent silently dropped', 'both directions stay in step; agent outside the department refused', 'Same'],
 'SK-D03': ['Delete a skill that tickets use', 'allowed; removed from ticket #181', 'allowed; removed from tickets; dialog lists where it is used first', 'Same'],
 'SK-B08': ['Skill name with HTML shown on the page', 'n/a (refused)', 'escaped, shown literally', 'Same'],
};
t = t.split('\n').map(l => { const m = l.match(/^\| (SK-[A-Z]\d+) \|/); return m && rows[m[1]] ? `| ${m[1]} | ${rows[m[1]].join(' | ')} |` : l; }).join('\n');
fs.writeFileSync(f, t);
