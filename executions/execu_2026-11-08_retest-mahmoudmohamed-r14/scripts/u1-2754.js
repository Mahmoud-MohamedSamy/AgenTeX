const o = {}; const G2 = '7326ffa9-27c8-41f7-b8dc-35fb64c40e07', G1 = '366c00b8-7b45-41ea-b670-631c4a045d08';
await page.goto(H + '/views/all/tickets/' + G2, { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); const t = await text(); if (/g2 admin-owned/.test(t) && /QA alt/.test(t)) break; } await sleep(3000);
await shot('2754-a1-agent-ticket.png'); const t = await text(); o.ticket = { subject: /g2 admin-owned/.test(t), alt: /QA alt/.test(t), go: /QA go/.test(t) };
const alt = page.getByRole('button', { name: /QA alt/ }).first();
if (await alt.count()) { await alt.click(); await sleep(5000); await shot('2754-a2-agent-alt-form.png'); const dlg = page.locator('[role=dialog]').last(); o.form = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 700);
  o.askAdmin = /ask an admin|does not include sharing/i.test(o.form);
  // pick Dept B in the share row and run the step from the screen
  const dd = dlg.locator('button,[role=combobox]').filter({ hasText: /department|Select|Choose/i }).first(); o.ddCount = await dd.count();
  if (o.ddCount) { await dd.click(); await sleep(1500); const opt = page.getByRole('option', { name: /QA RT14 2754 Dept B/ }).first(); o.optB = await opt.count(); const optA = await page.getByRole('option', { name: /QA RT14 2754 Dept A/ }).count(); o.ownDeptOffered = optA;
    if (o.optB) { await opt.click(); await sleep(1500); } else await page.keyboard.press('Escape'); }
  await shot('2754-a3-agent-alt-filled.png'); o.filled = (await dlg.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
  const go = dlg.getByRole('button', { name: /^(Save|Submit|Proceed|Run|Done|Confirm|Complete)/i }).last(); o.goBtn = await go.count();
  if (o.optB && o.goBtn) { await go.click(); await sleep(7000); await shot('2754-a4-agent-after-run.png'); o.after = ((await text()).match(/.{0,160}(not available|Closed|permission|error|failed).{0,160}/i) || [''])[0]; }
}
return o;
