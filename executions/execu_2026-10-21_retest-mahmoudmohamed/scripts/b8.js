const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', R = '8e8227b2-a494-47e3-a368-4e2880e49c39';
const st = async () => Object.fromEntries((await api('GET', `/modules/${D}/records/${R}`)).j.data.data.filter(x => /pipeline|stage/.test(x.field)).map(x => [x.field, x.value.value]));
const stop = capOn();
await page.locator('[role=dialog]').getByRole('button', { name: 'Change pipeline' }).click(); await sleep(4000);
const after = await st(); const head = (await txt()).split('PIPELINE')[1]?.slice(0, 200);
await shot('1302-04-on-pipeline1');
const res = { afterChange: { api: after, head, toast: await page.locator('[role=status],[data-sonner-toast]').allInnerTexts() } };
// click stage test-02, then needs_analysis
for (const sname of ['test-02', 'qualification', 'identify_decision_makers']) {
  cap.length = 0;
  await page.locator('main').getByText(sname, { exact: true }).first().click(); await sleep(4000);
  const dl = await page.locator('[role=dialog]').allInnerTexts();
  res[sname] = { dialog: dl, toast: await page.locator('[role=status],[data-sonner-toast]').allInnerTexts(), api: await st(), req: cap.filter(c => /^(PATCH|PUT|POST) \/modules/.test(c)) };
  if (dl.length) { await shot('1302-05-stage-dialog-' + sname); await page.keyboard.press('Escape'); await sleep(800); }
}
await shot('1302-06-final');
stop();
return done(res);
