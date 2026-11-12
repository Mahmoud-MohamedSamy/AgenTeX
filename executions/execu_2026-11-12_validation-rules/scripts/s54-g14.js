// G14: blueprint AEO-01 (Leads, default layout). Rules only for our lead (Applies when last name starts with QA VR1112)
const mid = await modId(); const DL = I.defLayout; const o = {}; const W = C('startsWith', 'last_name', 'QA VR1112');
const r1 = await mkRule(mid, { name: P + ' G14 email', layoutId: DL, primaryField: 'email', branches: [B(C('contains', 'email', 'bad'), 'QA G14 email cannot contain bad', { when: W })] }); o.r1 = SR(r1).slice(0, 150);
const r2 = await mkRule(mid, { name: P + ' G14 first', layoutId: DL, primaryField: 'first_name', branches: [B(C('eq', 'first_name', 'AEX-01-BP'), 'QA G14 first name cannot be AEX-01-BP', { when: W })] }); o.r2 = SR(r2).slice(0, 150);
const lead = await mkRec(mid, { first_name: 'QA AEX-01 VR1112', last_name: 'QA VR1112 G14', email: 'qa.g14@example.com', lead_source: 'chat' }, DL); o.lead = lead.s + ' ' + lead.err;
if (lead.id) {
  const st = await api('GET', '/modules/' + mid + '/records/' + lead.id + '/blueprint-state'); o.state = SR(st).slice(0, 200) + JSON.stringify(st.j && st.j.data).slice(0, 200);
  const tr = await api('GET', '/modules/' + mid + '/records/' + lead.id + '/blueprint-transitions'); o.trs = JSON.stringify(tr.j && tr.j.data).slice(0, 300);
  const T = 't_mt4pe97q_0'; const url = '/modules/' + mid + '/records/' + lead.id + '/blueprint-transitions/' + T;
  const a = await api('POST', url, { fieldValues: { email: 'bad@example.com' }, checklist: { cl_mt4pgbtl_0: true }, completedChecklistIds: ['cl_mt4pgbtl_0'] }); o.badForm = SR(a).slice(0, 400);
  const b = await api('POST', url, { fieldValues: { email: 'good@example.com' }, checklist: { cl_mt4pgbtl_0: true }, completedChecklistIds: ['cl_mt4pgbtl_0'] }); o.goodForm = SR(b).slice(0, 400);
  const g = await api('GET', '/modules/' + mid + '/records/' + lead.id); o.after = JSON.stringify((g.j && g.j.data && g.j.data.data || []).filter(x => /first_name|email|lead_source/.test(x.field)).map(x => x.field + '=' + (x.value && x.value.value)));
}
for (const r of [r1, r2]) if (r.j && r.j.data) await delRule(mid, r.j.data.id);
return o;
