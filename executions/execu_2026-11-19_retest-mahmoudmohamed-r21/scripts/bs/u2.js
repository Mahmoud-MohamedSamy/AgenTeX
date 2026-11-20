const ID = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'; const out = {};
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'en')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(3000); if (/QA go/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'QA go', exact: true }).click(); await sleep(3000);
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(5000);
for (let i = 0; i < 20; i++) { await sleep(2000); if (/No transitions you can run/.test(await text())) break; }
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('QA RT20 BS 3056 flow /'); out.header = t.slice(i, i + 300); out.noTr = /No transitions you can run/.test(t);
await shot('3056-b1-header-escalated-en.png');
await page.getByText('View configured actions').last().click(); await sleep(3000);
out.popup = (await page.getByRole('dialog').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
await shot('3056-b2-popup-escalated-en.png');
return out;
