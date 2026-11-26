const MADE = '../made.json';
const made = JSON.parse(fs.readFileSync(MADE, 'utf8'));
const keep = () => fs.writeFileSync(MADE, JSON.stringify(made, null, 1));
const AG_A = '9d182dfa-05f3-4af7-9685-8615a2fbe537', AG_B = '2a7c1bc4-f6d4-4bd3-805e-0496ece13987';
const tid = made.other.find(x => x.kind === 'team').id;
const o = {};
const base = { name: 'QA BP Reg Team', description: 'QA blueprint regression', department_id: made.dept };
for (const [m, p, b] of [['PUT', '/desk/teams/' + tid, { ...base, member_user_ids: [AG_B, AG_A] }], ['PUT', '/desk/teams/' + tid + '/members', { user_ids: [AG_B, AG_A] }], ['POST', '/desk/teams/' + tid + '/members', { user_ids: [AG_B, AG_A] }]]) {
  const r = await api(m, p, b); o[m + ' ' + p.replace(tid, '{id}')] = r.s + ' ' + JSON.stringify(r.j?.error || '').slice(0, 200);
  const now = (await api('GET', '/desk/teams/' + tid)).j?.data?.member_user_ids || [];
  if (now.length === 2) { o.members = now.length; break; }
}
const tl = (await api('GET', '/desk/email-templates')).j?.data;
o.useCases = (tl.use_cases || []).map(u => typeof u === 'string' ? u : `${u.key || u.use_case || u.id}:${u.notification_type || ''}`);
o.maxTemplates = tl.max_templates;
const uc = o.useCases.find(u => /blueprint/i.test(u)) || o.useCases.find(u => /custom|workflow/i.test(u));
if (uc && !made.other.find(x => x.kind === 'template')) {
  const [key, nt] = uc.split(':');
  const r = await api('POST', '/desk/email-templates', { name: 'QA BP Reg template', module: 'desk_tickets', notification_type: nt || 'contact', use_case: key, subject: 'QA BP Reg #{{ticket.number}} {{ticket.subject}}', body_html: '<p>QA BP Reg: ticket {{ticket.subject}} moved in its blueprint.</p>' });
  o.template = uc + ' → ' + r.s + ' ' + JSON.stringify(r.j?.error || '').slice(0, 200);
  if (r.j?.data?.id) { made.other.push({ kind: 'template', id: r.j.data.id, name: 'QA BP Reg template', use_case: key }); keep(); }
}
return o;
