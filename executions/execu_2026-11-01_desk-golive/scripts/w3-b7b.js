const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
out.api4 = (await api("PATCH", "/workflow/custom-actions/" + A, { timeoutSeconds: 4 })).t.slice(0, 220); out.api181 = (await api("PATCH", "/workflow/custom-actions/" + A, { timeoutSeconds: 181 })).t.slice(0, 220); out.now = D((await api("GET", "/workflow/custom-actions/" + A)).j).timeoutSeconds;
await go('/views/all/tickets/' + T1, 12000);
await page.locator('#main-content').getByRole('button', { name: 'Actions', exact: true }).click(); await sleep(1200);
await page.getByRole('menuitem', { name: 'QA GL W3 echo' }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); const ins = d.locator('input:visible'); await ins.nth(0).fill('QAREF-SLOW'); await ins.nth(1).fill('QA GL W3 slow case');
const t0 = Date.now(); await d.getByRole('button', { name: /^Run/ }).last().click();
for (let i = 0; i < 40; i++) { await sleep(1000); const tx = await d.innerText().catch(() => ''); if (/ran successfully|Failed|timed out|took too long|Run again/i.test(tx)) break; }
out.secs = Math.round((Date.now() - t0) / 1000);
out.ui = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 600); out.toast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | '); await shot('w3/W3-15-timeout-5s');
const r = NET.find(n => /\/run$/.test(n.u)); out.api = r ? r.s + ' ' + r.t.slice(0, 450) : 'no run call';
return fin({ out });
