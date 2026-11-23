const out = {};
await page.goto(H + '/views/all/tickets/657d9a23-d604-49fc-a359-88869211f9d0', { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 dyn D1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(6000);
await page.getByRole('button', { name: 'Assign owners' }).first().click();
const dlg = page.getByRole('dialog');
for (let i = 0; i < 30; i++) { await sleep(2000); if (!/Loading departments/.test(await dlg.innerText().catch(() => 'Loading departments'))) break; }
out.dlg = (await dlg.innerText()).replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+/g, '<mail>').slice(0, 1200);
out.selects = await page.evaluate(() => [...document.querySelectorAll('[role=dialog] select')].map(s => [...s.options].map(o => o.text)));
const cb = page.locator('[role=dialog] [role=combobox], [role=dialog] input').first(); if (await cb.count()) { await cb.click().catch(() => {}); await sleep(1500); out.opts = (await page.locator('[role=option]').allInnerTexts()).map(x => x.replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+/g, '<mail>')).slice(0, 30); }
await shot('3065-13-ticket-assign-owners.png');
return out;
