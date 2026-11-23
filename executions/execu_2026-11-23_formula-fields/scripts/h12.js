// H12: formulas on Leads and Contacts; convert a QA FX lead; target formula worked out from target fields.
const mods = L((await api('GET', '/modules')).j?.data); const LEADS = mods.find(m => m.moduleKey === 'leads').id, CON = mods.find(m => m.moduleKey === 'contacts').id;
const lf = L((await api('GET', `/modules/${LEADS}/fields`)).j?.data).map(f => f.fieldName), cf = L((await api('GET', `/modules/${CON}/fields`)).j?.data).map(f => f.fieldName);
log('leads has', ['first_name', 'last_name', 'phone', 'email'].filter(x => lf.includes(x)), 'contacts has', ['first_name', 'last_name', 'phone', 'email'].filter(x => cf.includes(x)));
made.live ||= { fields: [], records: [] };
const add = async (m, n, e) => { const r = await api('POST', `/modules/${m}/fields`, { fields: [fdef(n, 'QA FX ' + n, 'formula', { expression: e, return_kind: 'string' })] }); if (r.s < 300) { made.live.fields.push([m, n]); keep(); led('CRM live formula ' + n + ' on ' + m); } return E(r); };
log('lead formula', await add(LEADS, 'qa_fx_lead_label', 'upper(concat(first_name, " ", last_name))'));
log('contact formula', await add(CON, 'qa_fx_contact_label', 'upper(concat(first_name, " ", last_name))'));
const lay = (await api('GET', `/modules/${LEADS}/layouts`)).j; const ld = (Array.isArray(lay.data) ? lay.data : lay.data.layouts); const LL = (ld.find(l => l.isDefault) || ld[0]).id;
const lr = await api('POST', `/modules/${LEADS}/records`, { layout_id: LL, data: data({ first_name: 'qafx', last_name: 'h12 lead', phone: '01000000012', lead_source: null }) });
log('lead', E(lr).slice(0, 300)); const lid = lr.j?.data?.id; if (!lid) return; made.live.records.push([LEADS, lid]); keep(); led('CRM lead QA FX h12 ' + lid);
log('lead formula value', flat(lr.j.data.data).qa_fx_lead_label);
const c = await api('POST', `/modules/${LEADS}/records/${lid}/convert`, {}); log('convert', E(c).slice(0, 400), JSON.stringify(c.j?.data).slice(0, 400));
const ids = JSON.stringify(c.j?.data || {}).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) || [];
for (const id of [...new Set(ids)]) { const r = await api('GET', `/modules/${CON}/records/${id}`); if (r.s === 200) { made.live.records.push([CON, id]); keep(); const v = flat(r.j.data.data); log('contact', id, JSON.stringify({ first: v.first_name, last: v.last_name, qa_fx_contact_label: v.qa_fx_contact_label, copiedLeadFormula: v.qa_fx_lead_label })); } }
