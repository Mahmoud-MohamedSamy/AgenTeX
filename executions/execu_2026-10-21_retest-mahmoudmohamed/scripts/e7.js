const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.getByText('I confirm I have permission', { exact: false }).click(); await sleep(500);
await page.getByRole('button', { name: 'Submit' }).click();
for (let i = 0; i < 40 && !/Import complete|completed|finished/i.test(await txt()); i++) await sleep(1500);
const t = (await txt()).split('Result')[1]?.slice(0, 1500);
await shot('1323-05-result');
const recs = arr((await api('GET', `/modules/${D}/records?page=1&per_page=200`)).j.data).filter(r => /QA RT 1323/.test(JSON.stringify(r.data)));
const pn = { '5170500c-b335-479c-96d1-ed138965c345': 'Standard', '640e03a4-9c24-4b06-8d7d-5c1db2711b9b': '1' };
return done({ t, recs: recs.map(r => ({ id: r.id, ...Object.fromEntries(r.data.filter(x => /deal_name|pipeline|stage|probability|expected/.test(x.field)).map(x => [x.field, pn[x.value.value] || x.value.value])) })) });
