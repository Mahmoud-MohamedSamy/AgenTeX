// Desk (Anyware) setup for the Modules and Fields retests: QA module "QA RT r10 MF" (+ a department-storage module) with test fields.
const out = {}; const TS = 'd1cacab7-85d4-476f-88f0-1cc6e6788946';
const mk = async (key, label, extra = {}) => { const r = await api('o', 'POST', `desk:/teamspaces/${TS}/modules`, { moduleKey: key, labels: { en: label }, pluralForm: label, singularForm: label + ' rec', description: 'QA RT r10, deleted afterwards', ...extra }); if (r.j?.data?.id) ledger(`desk module ${r.j.data.id} "${label}"`); return r; };
const m = await mk('qa_rt_r10_mf', 'QA RT r10 MF'); out.mod = m.s + ' ' + (m.j?.data?.id || m.t.slice(0, 300)); const M = m.j?.data?.id; if (!M) return out;
const d = await mk('qa_rt_r10_dept', 'QA RT r10 DeptMod', { storageScope: 'department' }); out.deptMod = d.s + ' ' + (d.j?.data?.id || d.t.slice(0, 300)) + ' storage=' + d.j?.data?.storageScope;
const f = (n, l, t, o, req) => ({ fieldName: n, labels: { en: l }, datatypeKey: t, required: !!req, unique: false, ...(o ? { datatypeOptions: o } : {}) });
const fr = await api('o', 'POST', `desk:/modules/${M}/fields`, { fields: [f('qa_sl', 'QA sl', 'single_line'), f('qa_kind', 'QA kind', 'pick_list', { allowed_values: ['Hardware', 'Software'] }), f('qa_serial', 'QA serial', 'single_line'), f('qa_ctrl', 'QA ctrl', 'pick_list', { allowed_values: ['x', 'Z'] }), f('qa_dep', 'QA dep', 'single_line')] });
out.fields = fr.s + ' ' + (fr.s > 299 ? fr.t.slice(0, 300) : '');
const fl = arr((await api('o', 'GET', `desk:/modules/${M}/fields`)).j?.data); out.fl = fl.map(x => x.apiName + ':' + x.id.slice(0, 8) + ':' + x.datatypeKey + (x.required ? '*' : ''));
const ls = arr((await api('o', 'GET', `desk:/modules/${M}/layouts`)).j?.data); out.layouts = ls.map(l => l.id + ' ' + l.name);
out.M = M; out.D = d.j?.data?.id; return out;
