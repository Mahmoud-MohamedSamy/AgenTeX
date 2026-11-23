const out = {};
await page.goto(H + '/views/all/tickets/657d9a23-d604-49fc-a359-88869211f9d0', { waitUntil: 'domcontentloaded' });
await page.getByText('QA RT20 BP 3065 dyn D1').first().waitFor({ timeout: 120000 }).catch(() => {}); await sleep(6000);
const ao = page.getByText(/Assign owners|Choose owners|Owners/i); out.cands = (await ao.allInnerTexts()).slice(0, 8);
const btn = page.getByRole('button', { name: /owner/i }); out.btns = (await btn.allInnerTexts()).slice(0, 8);
const target = page.getByRole('button', { name: /Assign owners|Change owners|Set owners|owners/i }).first();
if (await target.count()) { await target.click(); await sleep(3000); const t = (await text()).replace(/\s+/g, ' '); const i = t.search(/owners/i); out.dlg = t.slice(Math.max(0, i - 50), i + 900).replace(/[\w.+-]+@[\w.-]+/g, '<mail>');
  const inp = page.locator('[role=dialog] input').first(); if (await inp.count()) { await inp.fill('Mahmoud'); await sleep(2500); out.searchMahmoud = (await page.locator('[role=dialog]').innerText()).replace(/\s+/g, ' ').replace(/[\w.+-]+@[\w.-]+/g, '<mail>').slice(0, 600); }
  await shot('3065-13-ticket-assign-owners.png'); }
return out;
