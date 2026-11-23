const dialogs = []; page.on('dialog', async d => { dialogs.push(d.message()); await d.dismiss(); });
await page.goto(H + `/modules/${made.mod}/records/new`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX UI Triple/i.test(await text())) break; } await sleep(1500);
log('url', page.url()); await shot('desk-J1-create-form');
const t0 = await text(); log('has form', /QA FX UI Triple/i.test(t0), /Computed after save/.test(t0));
if (/QA FX UI Triple/i.test(t0)) {
  await page.getByPlaceholder('Name').first().fill('QA FX Desk UI H1'); await page.getByLabel('QA Num', { exact: true }).first().fill('4');
  await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(7000); log('after save url', page.url());
  for (let i = 0; i < 20; i++) { if (/QA FX UI TRIPLE/i.test(await text('main'))) break; await sleep(1500); }
  const t = await text('main'); log('I1 value', JSON.stringify((t.match(/QA FX UI TRIPLE\s*\n\s*(\S+)/i) || [])[1]));
  await page.getByText(/QA FX UI Triple/i).first().scrollIntoViewIfNeeded().catch(() => { }); await shot('desk-H1-record');
  fs.writeFileSync(RUN + '/out/desk-h1-url.txt', page.url());
}
return;
await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA FX L1 HTML/i.test(await text('main'))) break; }
await page.getByText(/QA FX L1 html/i).first().scrollIntoViewIfNeeded().catch(() => { }); await sleep(800); await shot('desk-L1-record');
const t2 = await text('main'); const i2 = t2.search(/QA FX L1 HTML/i); log('L1', JSON.stringify(t2.slice(i2, i2 + 110)), 'img', await page.locator('img[src="x"]').count(), 'dialogs', dialogs);
