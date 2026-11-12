const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const src = (await api('GET', '/web-forms/639914b8-a2af-4d37-94dd-a55a9585b3f6')).j.data; const def = JSON.parse(JSON.stringify(src.definition));
const one = def.fields.find(f => f.key === 'priority') || def.fields[0]; const out = { fieldShape: JSON.stringify(one).slice(0, 300) };
const mk = (key, extra = {}) => ({ ...JSON.parse(JSON.stringify(def.fields.find(f => f.key === 'subject'))), key, label: null, required: false, ...extra });
const add = ['qa_lr_type', 'qa_lr_note', 'qa_lr_filter', 'qa_lr_tier', 'qa_lr_order'].map(k => { const f = mk(k); return f; });
def.fields = [...def.fields, ...add];
const body = { kind: 'help_center_form', name: P + ' HC form', department_id: CS, layout_id: I.layout, module_id: I.mod_desk_tickets, definition: def };
const r = await api('POST', '/web-forms', body); out.create = SR(r).slice(0, 400); if (r.j && r.j.data) { I.hcform = r.j.data.id; SAVE(); LED('HC form (help_center_form) ' + I.hcform + ' for CS on QA layout'); const g = (await api('GET', '/web-forms/' + I.hcform)).j.data; out.status = g.status || g.state; out.fields = g.definition.fields.map(f => f.key + ':' + (f.input_type || f.type || '')); out.keys = Object.keys(g).join(','); }
return out;
