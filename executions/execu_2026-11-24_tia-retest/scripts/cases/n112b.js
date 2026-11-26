const all = ids();
const lead = (await api('GET', `/modules/${M.leads}/records/${all.lead}`)).j?.data;
const vals = lead?.values || lead?.data || lead;
const src = JSON.stringify(vals).match(/"lead_source"[^}]{0,80}/)?.[0];
const q = async s => { const r = await api('GET', `/modules/${M.leads}/records?page=1&per_page=20&filters=${encodeURIComponent(JSON.stringify([{ field: 'name', operator: 'starts_with', value: s }]))}`); return arr(r.j?.data).map(x => x.id + ' ' + (x.name || x.values?.name || '')); };
const before = await q('QA TIA RT J');
const r = await ask('Create a lead with first name QA TIA RT J04, last name Lead, company QA Co, Single Line Permission QA');
const s = short(r); let conf = null;
if (s.actions[0]) { const c = await api('POST', `/agents/tia/actions/${s.actions[0].id}/confirm`, {}); conf = { s: c.s, data: c.j?.data, err: c.j?.error }; }
const after = await q('QA TIA RT J');
return { leadSource: src, before, ask: s, conf, after };
