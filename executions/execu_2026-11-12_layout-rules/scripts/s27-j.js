const mid = await modId(); const lid = I.layout; const out = {};
const strip = l => { const b = { ...l }; delete b.id; if (APP === 'crm') for (const k of ['displayInHelpCenter', 'helpCenterDisplayName', 'departmentIds', 'defaultDepartmentIds', 'ticketStatuses', 'allowNonDepartmentAgents']) delete b[k]; return b; };
const putLay = async l => api('PUT', '/modules/' + mid + '/layouts/' + lid, strip(l));
// J4
let tmp = (await fieldsOf(mid)).find(f => f.fieldName === 'qa_lr_tmp');
if (!tmp) { await api('POST', '/modules/' + mid + '/fields', { fields: [{ fieldName: 'qa_lr_tmp', datatypeKey: 'single_line', labels: { en: P + ' tmp' }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] }] }); tmp = (await fieldsOf(mid)).find(f => f.fieldName === 'qa_lr_tmp'); }
const lay = await getLayout(mid, lid); for (const v of Object.values(lay.views)) { const s = v.layout.sections.find(x => x.id === 'sec-qa-lr-a'); if (s && !s.columns[0].fields.some(f => f.fieldName === 'qa_lr_tmp')) s.columns[0].fields.push(JSON.parse(JSON.stringify(tmp))); }
out.place = SR(await putLay(lay)).slice(0, 200);
const g = (await getRule(mid, I.c1)).j.data; const br2 = JSON.parse(JSON.stringify(g.branches)); br2[0].actions.push(show(['qa_lr_tmp']));
out.addTarget = SR(await putRule(mid, I.c1, { ...g, branches: br2 })).slice(0, 160);
out.J1_usage = (await api('GET', '/modules/' + mid + '/rule-usage?field=qa_lr_tmp')).t.slice(0, 250);
const del = await api('DELETE', '/modules/' + mid + '/fields/' + tmp.id); out.J4_delete = SR(del).slice(0, 300);
const ra = (await getRule(mid, I.c1)).j?.data; out.J4_rule_after = 'definitionError=' + JSON.stringify(ra?.definitionError) + ' warnings=' + JSON.stringify(ra?.warnings) + ' targets=' + JSON.stringify(ra?.branches?.[0]?.actions);
// J2 remove primary (vip) from layout
const lay2 = await getLayout(mid, lid); const keep = JSON.parse(JSON.stringify(lay2));
for (const v of Object.values(lay2.views)) for (const s of v.layout.sections) for (const c of s.columns) c.fields = c.fields.filter(f => f.fieldName !== 'qa_lr_vip');
out.J2_remove = SR(await putLay(lay2)).slice(0, 300);
const vr = (await getRule(mid, I.r3)).j?.data; out.J2_rule = 'status=' + vr?.status + ' definitionError=' + JSON.stringify(vr?.definitionError);
I.layoutKeep = true; SAVE();
fs.writeFileSync(RUN + '/out/layout-keep-' + APP + '.json', JSON.stringify(keep));
return out;
