const L = M.leads; const S = v => ({ kind: 'string', value: String(v) });
const r = await api('POST', `/modules/${L}/records`, { data: [{ field: 'name', value: S('QA TIA P3 B04c') }, { field: 'first_name', value: S('QA TIA P3') }, { field: 'last_name', value: S('B04c') }, { field: 'company', value: S('QA P3 Co') }, { field: 'lead_source', value: S('web') }] }); const id = r.j?.data?.id; ledger('P3: lead QA TIA P3 B04c ' + id + ' — delete in R'); const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); (I2.extraLeads = I2.extraLeads || []).push(id); fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1));
const x = await askCard('Change the company of the lead "QA TIA P3 B04c" to QA P3 From Card.');
const p = await api('PATCH', `/modules/${L}/records/${id}`, { data: [{ field: 'company', value: S('QA P3 From Form') }] });
const c = x.acts[0] ? await confirmA(x.acts[0]) : null; const v = val((await getRec(L, id)).rec, 'company');
const tl = await api('GET', `/timeline/records/leads/${id}/feed`); const h = (tl.j?.data?.data || tl.j?.data || []).filter(e => e.field_key === 'company').map(e => `${e.previous_value}→${e.new_value}`);
p3rec('B-04', '?', `card=${x.card || 'none'}; form change to partner after the card=${p.s} ${(p.j?.error?.message || '').slice(0, 100)}; confirm=${JSON.stringify(c)}; final value=${v}; history=${JSON.stringify(h)}`, { conv: x.conv });
return { p: p.s, c, v, h };
