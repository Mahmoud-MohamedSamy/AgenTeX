const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', R = '221c25cd-5c19-4833-a890-46ab6aa5ed79';
const pn = { '5170500c-b335-479c-96d1-ed138965c345': 'Standard', '640e03a4-9c24-4b06-8d7d-5c1db2711b9b': '1' };
const st = async () => Object.fromEntries((await api('GET', `/modules/${D}/records/${R}`)).j.data.data.filter(x => /pipeline|stage/.test(x.field)).map(x => [x.field, pn[x.value.value] || x.value.value]));
await go(`/modules/${D}/records/${R}`, 9000);
const head0 = (await txt()).split('Timeline')[1]?.slice(0, 200);
await shot('1302-07-deal-on-pipeline1');
const res = { head0 };
for (const s of ['qualification', 'negotiation', 'test-01']) {
  const strip = page.locator('main').getByText(s, { exact: true }).first();
  await strip.click(); await sleep(2500);
  const dl = await page.locator('[role=dialog]').allInnerTexts();
  if (dl.length) { await shot('1302-08-dialog-' + s); const b = page.locator('[role=dialog]').getByRole('button', { name: /Save|Confirm|Update|Move/ }).first(); if (await b.count()) { await b.click(); await sleep(3000); } }
  res[s] = { dialog: dl.map(x => x.slice(0, 300)), toasts: await page.locator('[data-sonner-toast]').allInnerTexts(), api: await st(), head: (await txt()).split('Timeline')[1]?.slice(0, 40) };
}
await shot('1302-09-after-stage-clicks');
return done(res);
