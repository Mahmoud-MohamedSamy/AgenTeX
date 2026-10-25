const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAYOUT = '563411f4-6c8e-4b98-a91d-c618d88a5138';
await page.getByLabel('Custom view name').fill('QA RT 2101 lookup');
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/views$/.test(q.url().split('?')[0])) resp.push({ s: r.status(), id: (await r.json().catch(() => ({})))?.data?.id }); }; page.on('response', f);
await page.getByRole('button', { name: /^Save$/ }).last().click();
for (let k = 0; k < 30 && !resp.length; k++) await sleep(1000);
page.off('response', f);
const id = resp[0]?.id; const out = { save: resp };
if (id) {
  const v = (await api('GET', `/modules/${L}/views/${id}`)).j.data; out.criteria = v.settings?.criteria;
  const names = async vid => { const r = await api('GET', `/modules/${L}/records?page=1&per_page=50&layout_id=${LAYOUT}&view_id=${vid}`); return { total: r.j?.meta?.total_count, names: arr(r.j?.data).map(x => (x.data || []).find(d => d.field === 'first_name')?.value?.value) }; };
  out.result = await names(id);
  const C = out.criteria.conditions;
  const mk = async (n, conds) => { const r = await api('POST', `/modules/${L}/views`, { name: n, kind: 'list', visibility: 'private', layout_id: LAYOUT, settings: { criteria: { conditions: conds } } }); const i = r.j?.data?.id; return i ? { id: i, ...(await names(i)) } : r.t.slice(0, 200); };
  const lk = C.find(c => c.field === 'lookup_3_9');
  out.eq = await mk('QA RT 2101 eq', [lk]);
  out.ne = await mk('QA RT 2101 ne', [{ ...lk, operator: 'not_equal_to' }]);
  out.empty = await mk('QA RT 2101 empty', [{ field: 'lookup_3_9', operator: 'is_empty' }]);
  out.notEmpty = await mk('QA RT 2101 notempty', [{ field: 'lookup_3_9', operator: 'is_not_empty' }]);
  out.multi = await mk('QA RT 2101 multi', [C.find(c => c.field === 'multi_select_lookup_8_9')]);
}
await sleep(2000); await shot('2101-07-saved');
return done(out);
