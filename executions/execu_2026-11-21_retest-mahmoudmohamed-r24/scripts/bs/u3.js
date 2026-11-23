const ID = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'; const out = {};
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'en')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(3000); if (/QA end/.test(await text())) break; } await sleep(2000);
await shot('3056-c1-header-end-en.png');
await page.getByText('View configured actions').last().click(); await sleep(3000);
out.popup1 = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('3056-c2-popup-end-en.png'); await page.keyboard.press('Escape'); await sleep(1000);
await page.getByRole('button', { name: 'QA end', exact: true }).click(); await sleep(3000); await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(6000);
for (let i = 0; i < 20; i++) { await sleep(2000); if (/QA reopen/.test(await text())) break; }
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('QA RT20 BS 3056 flow /'); out.header = t.slice(i, i + 200);
await shot('3056-c3-header-closed-en.png');
await page.getByText('View configured actions').last().click(); await sleep(3000);
out.popup2 = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('3056-c4-popup-closed-en.png');
return out;
