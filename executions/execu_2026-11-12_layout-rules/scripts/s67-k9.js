const RUNX = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_layout-rules'; const OI = JSON.parse(fs.readFileSync(RUNX + '/out/ids-crm.json', 'utf8')); const mid = OI.mod_leads;
const out = {}; const r = await api('GET', '/modules/' + mid + '/records/' + OI.G6); out.s = r.s; const d = r.j.data ? r.j.data.data : []; out.hasDate = d.some(x => x.field === 'qa_lr_date'); out.hasOrder = d.some(x => x.field === 'qa_lr_order');
const g = await api('GET', '/modules/' + mid + '/layout-rules/' + OI.rF); out.caRO = JSON.stringify((g.j.data.branches[0].actions || []).filter(a => a.type === 'read_only_fields' || a.type === 'show_message'));
out.h7 = (await api('GET', '/modules/' + mid + '/records/fdbcd8f8-c6dd-45ff-9d51-89c1764c9a6b')).j.data.data.filter(x => /qa_lr_(type|order)|first_name/.test(x.field)).map(x => x.field + '=' + JSON.stringify(x.value.value));
return out;
