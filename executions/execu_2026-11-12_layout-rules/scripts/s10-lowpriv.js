// as a low-privilege user: read + write attempts on the owner's QA rule (ids from owner lane files)
const RUNX = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules';
const app = process.env.APP; const OI = JSON.parse(fs.readFileSync(RUNX + '/out/ids-' + app + '.json', 'utf8'));
const mid = OI['mod_' + (app === 'crm' ? 'leads' : 'desk_tickets')]; const rid = OI.c1;
const me = await api('GET', '/iam/me'); const who = me.j?.data ? { roles: JSON.stringify(me.j.data.roles || me.j.data.role || me.j.data.profiles || '').slice(0, 160) } : me.s;
const out = { who };
out.list = (await api('GET', '/modules/' + mid + '/layout-rules')).s;
const g = await api('GET', '/modules/' + mid + '/layout-rules/' + rid); out.get = g.s;
out.post = (await api('POST', '/modules/' + mid + '/layout-rules', { name: 'QA LR1112 lowpriv', layoutId: OI.layout, primaryField: 'qa_lr_vip', status: 'disabled', branches: [{ condition: { op: 'eq', field: 'qa_lr_vip', value: true }, actions: [{ type: 'show_fields', fields: ['qa_lr_note'] }] }] })).s;
out.put = g.j?.data ? (await api('PUT', '/modules/' + mid + '/layout-rules/' + rid, { ...g.j.data, description: 'lowpriv edit' })).s : 'skip';
out.order = (await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: OI.layout, ruleIds: [rid] })).s;
out.del = (await api('DELETE', '/modules/' + mid + '/layout-rules/' + rid)).s;
out.usage = (await api('GET', '/modules/' + mid + '/rule-usage?field=qa_lr_type')).s;
return out;
