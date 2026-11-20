const ID = '5c68004d-860c-4bcd-b6b8-77e0bce5c044'; const out = {};
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'en')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(3000); if (/QA go/.test(await text())) break; } await sleep(2000);
// close via X button test
await page.getByText('View configured actions', { exact: true }).last().click(); await sleep(2500);
out.openBefore = (await page.getByRole('dialog').first().innerText()).replace(/\s+/g, ' ').slice(0, 60);
await page.getByRole('dialog').first().getByRole('button', { name: 'Close' }).click(); await sleep(1200); out.closedX = (await page.getByRole('dialog').count()) === 0;
await page.getByRole('button', { name: 'QA go', exact: true }).click(); await sleep(3000);
await page.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(5000);
for (let i = 0; i < 20; i++) { await sleep(2000); if (/No transitions you can run/.test(await text())) break; }
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('QA RT20 BS 3056 flow /'); out.header = t.slice(i, i + 220); out.noTr = /No transitions you can run/.test(t);
await shot('3056-r3-esc-en-ticket.png');
await page.getByText('View configured actions', { exact: true }).last().click(); await sleep(3000);
const d = page.getByRole('dialog').first(); out.popup = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.marks = await d.evaluate(e => [...e.querySelectorAll('[class*=primary-light]')].map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 60)));
await shot('3056-r3-esc-en-popup.png');
await d.evaluate(e => { [e, ...e.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 20 && getComputedStyle(x).overflowY !== 'visible').forEach(x => x.scrollTop = x.scrollHeight); }); await sleep(700); await shot('3056-r3-esc-en-popup-bottom.png');
// click outside
await page.mouse.click(200, 450); await sleep(1200); out.closedOutside = (await page.getByRole('dialog').count()) === 0;
return out;
