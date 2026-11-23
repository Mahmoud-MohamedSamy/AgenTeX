const dialogs = []; page.on('dialog', async d => { dialogs.push(d.message()); await d.dismiss(); });
const id = fs.readFileSync(RUN + '/out/l1-id.txt', 'utf8').trim();
await page.goto(H + `/modules/${made.mod}/records/${id}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX L1 HTML/i.test(await text('main'))) break; } await sleep(2000);
const el = page.getByText(/QA FX L1 html/i).first(); await el.scrollIntoViewIfNeeded().catch(() => { }); await sleep(800); await shot('L1-record-page');
const t = await text('main'); const i = t.search(/QA FX L1 HTML/i); log('L1 shown as', JSON.stringify(t.slice(i, i + 140)));
log('img elements with src=x', await page.locator('img[src="x"]').count(), 'bold tags in value', await page.locator('b:text("bold")').count(), 'dialogs', dialogs);
