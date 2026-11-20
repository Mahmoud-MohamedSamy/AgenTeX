const ID = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7'; const out = {};
await page.goto(H + '/views/all/tickets/' + ID, { waitUntil: 'commit' }); await page.evaluate(() => localStorage.setItem('anyware_language', 'en')); await page.reload({ waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(3000); if (/QA reopen/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', { name: 'QA reopen', exact: true }).click(); await sleep(3000);
const dlg = page.getByRole('dialog').first(); out.form = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await shot('3056-r3-reopen-form.png');
const cb = dlg.getByRole('checkbox').first(); if (await cb.count()) await cb.check().catch(async () => { await dlg.getByText('QA reopen check').click(); }); else await dlg.getByText('QA reopen check').click();
await sleep(800);
await dlg.getByRole('button', { name: 'Run', exact: true }).click(); await sleep(6000);
for (let i = 0; i < 20; i++) { await sleep(2000); if (/QA go/.test(await text())) break; }
const t = (await text()).replace(/\s+/g, ' '); const i = t.indexOf('QA RT20 BS 3056 flow /'); out.header = t.slice(i, i + 200);
await shot('3056-r3-reopened-en-ticket.png');
await page.getByText('View configured actions', { exact: true }).last().click(); await sleep(3000);
const d = page.getByRole('dialog').first(); out.popup = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
out.marks = await d.evaluate(e => [...e.querySelectorAll('[class*=primary-light]')].map(x => x.innerText.replace(/\s+/g, ' ').slice(0, 60)));
await shot('3056-r3-reopened-en-popup.png');
await d.evaluate(e => { [e, ...e.querySelectorAll('*')].filter(x => x.scrollHeight > x.clientHeight + 20 && getComputedStyle(x).overflowY !== 'visible').forEach(x => x.scrollTop = x.scrollHeight); }); await sleep(700); await shot('3056-r3-reopened-en-popup-bottom.png');
return out;
