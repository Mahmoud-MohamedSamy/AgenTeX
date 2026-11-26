const o = {}; const L = M.leads;
const b = await getRec(L, P3I.leadB); o.leadB = { name: val(b.rec, 'name'), title: val(b.rec, 'title'), first: val(b.rec, 'first_name'), last: val(b.rec, 'last_name') };
const a = await getRec(L, P3I.leadA); o.leadA = { name: val(a.rec, 'name'), last: val(a.rec, 'last_name') };
const F = arr((await api('GET', `/modules/${L}/fields`)).j?.data); o.lastNameField = F.filter(f => ['last_name', 'name', 'title'].includes(f.apiName)).map(f => f.apiName + ' label=' + (f.labels?.en) + ' required=' + f.required);
// control: can the Owner clear last_name on the normal API? use the WF lead (Tia-created, QA)
const c = await api('PATCH', `/modules/${L}/records/${P3I.wfLead || JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')).wfLead}`, { data: [{ field: 'last_name', value: { kind: 'string', value: '' } }] }); o.controlClearLast = c.s + ' ' + (c.j?.error?.code || '') + ' ' + (c.j?.error?.message || '').slice(0, 150);
const tl = await api('GET', `/timeline/records/leads/${P3I.leadA}/feed`); o.timelineRaw = JSON.stringify((tl.j?.data?.data || tl.j?.data || [])[0] || {}).slice(0, 700);
return o;
