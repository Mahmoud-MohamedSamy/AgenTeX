const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.getByText('I confirm I have permission', { exact: false }).click(); await sleep(500);
await page.getByRole('button', { name: 'Submit' }).click();
for (let i = 0; i < 60 && !/Import complete|completed with errors|Import failed|Partially/i.test(await txt()); i++) await sleep(1500);
const t = (await txt()).split('Result')[1]?.slice(0, 1200);
await shot('1592-01-result');
const recs = arr((await api('GET', `/modules/${L}/records?page=1&per_page=200&search=QA%20RT%20imp`)).j.data);
const mine = recs.filter(r => /QA RT imp/.test(JSON.stringify(r.data))).map(r => { const g = k => (r.data.find(x => x.field === k) || {}).value?.value; return { id: r.id, name: g('name'), pct: g('percent_8_9'), ms: g('multi_select_3_9') }; });
return done({ t, n: recs.length, mine });
