const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = { made: [] }; const S = v => ({ kind: 'string', value: v });
for (const [n, a] of [['QA RT amt 15000', 15000], ['QA RT amt 1e9', 1000000000]]) {
  const r = await api('POST', '/modules/' + D + '/records', { data: [{ field: 'name', value: S(n) }, { field: 'deal_name', value: S(n) }, { field: 'amount', value: { kind: 'number', value: a } }] });
  out.made.push(n + ' ' + r.s + ' ' + (r.j && r.j.data ? r.j.data.id : r.t.slice(0, 300)));
}
const views = { '15,000': 'f62b5cee-2f91-4ccc-accd-ae24ff6685ca', '1e9': 'f63e132f-5266-45f1-a66e-b1f35350c88e', '-1': '68ba22c0-50f1-48e0-8ff9-0b51242bb312' };
for (const [k, id] of Object.entries(views)) { const r = await api('GET', '/modules/' + D + '/records?view_id=' + id + '&page=1&per_page=50'); out['view ' + k] = arr(r.j && r.j.data).map(x => ((x.data || []).find(f => f.field === 'deal_name') || { value: {} }).value.value); }
await page.goto(H + '/modules/' + D + '?view=f62b5cee-2f91-4ccc-accd-ae24ff6685ca', { waitUntil: 'load', timeout: 90000 });
for (let i = 0; i < 30; i++) { await sleep(1000); if (/[1-9]\d* records?/.test(await txt())) break; } await sleep(2000);
out.ui = ((await txt()).match(/\d+ records?/) || [''])[0]; await shot('NDC-2100-view-15000-grid');
const p = await api('POST', '/modules/' + D + '/views', { name: 'QA RT amt abc', kind: 'list', visibility: 'private', settings: { criteria: { conditions: [{ field: 'amount', operator: 'equals', value: 'abc' }] } } });
out.abcAgain = p.s;
return done(out);
