// Phase 0: email template + verify everything made so far.
const MADE = '../made.json';
const made = JSON.parse(fs.readFileSync(MADE, 'utf8'));
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const has = k => made.other.find(x => x.kind === k);
const o = {};
const all = arr((await api('GET', '/desk/email-templates')).j?.data);
o.templatesInTenant = all.length; o.useCases = [...new Set(all.map(t => t.use_case))].slice(0, 20);
if (!has('template')) {
  const r = await api('POST', '/desk/email-templates', { name: 'QA BP Reg template', module: 'desk_tickets', notification_type: 'contact', use_case: 'workflow.custom', subject: 'QA BP Reg #{{ticket.number}} {{ticket.subject}}', body_html: '<p>QA BP Reg: ticket {{ticket.subject}} moved in its blueprint.</p>' });
  o.template = r.s + (r.s >= 300 ? ' ' + JSON.stringify(r.j?.error).slice(0, 300) : ''); if (r.j?.data?.id) { made.other.push({ kind: 'template', id: r.j.data.id, name: 'QA BP Reg template' }); keep(); }
}
const team = (await api('GET', '/desk/teams')).j?.data?.teams?.find(t => t.id === has('team').id);
o.team = team ? { name: team.name, dept: team.department_id === made.dept || team.departmentId === made.dept, keys: Object.keys(team).join(','), members: team.member_user_ids || team.members || team.memberUserIds } : 'not found';
const st = (await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || [];
o.statuses = st.filter(s => /QA BP (Verify|Done)/.test(s.value)).map(s => `${s.value}:${s.type}`);
const d = (await api('GET', '/desk/departments/' + made.dept)).j?.data;
o.dept = { name: d.name, agents: d.agent_user_ids.length, viewOnly: d.view_only_agent_user_ids.length, active: d.is_active };
o.made = made.other.map(x => x.kind + ' ' + x.name);
return o;
