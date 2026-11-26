// Team members are "sources" of kind agent. Team: Agent B (CES 1) + Agent A (CES 2).
const made = JSON.parse(fs.readFileSync('../made.json', 'utf8'));
const tid = made.other.find(x => x.kind === 'team').id;
const AG_A = '9d182dfa-05f3-4af7-9685-8615a2fbe537', AG_B = '2a7c1bc4-f6d4-4bd3-805e-0496ece13987';
const r = await api('PUT', '/desk/teams/' + tid, { name: 'QA BP Reg Team', description: 'QA blueprint regression', department_id: made.dept, sources: [{ kind: 'agent', ref_id: AG_B }, { kind: 'agent', ref_id: AG_A }] });
const one = (await api('GET', '/desk/teams/' + tid)).j?.data;
const tpl = made.other.find(x => x.kind === 'template');
const t = arr((await api('GET', '/desk/email-templates')).j?.data?.email_templates).find(x => x.id === tpl.id);
return { put: r.s + ' ' + JSON.stringify(r.j?.error || ''), members: one.member_user_ids, template: t ? { name: t.name, use_case: t.use_case, notification_type: t.notification_type } : 'not listed' };
