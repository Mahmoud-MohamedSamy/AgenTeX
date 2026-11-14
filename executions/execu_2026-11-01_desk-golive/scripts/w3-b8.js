await go('/settings/developer/custom-actions', 10000);
await page.getByRole('button', { name: 'Actions for QA GL W3 echo' }).click(); await sleep(1200);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.getByRole('menuitem', { name: /^Edit/ }).first().click(); await sleep(4000);
const tin = page.locator('input[type=number][placeholder=Default]:visible').first(); out.tin = await tin.count();
for (const v of ['4', '181']) { await tin.fill(v); await sleep(500); out['msg' + v] = ((await page.locator('body').innerText()).match(/[^.\n]*(5 to 180|between 5|at least 5|at most 180)[^.\n]*/gi) || []).slice(0, 3); }
await shot('w3/W3-19-timeout-181');
await tin.fill('5'); await sleep(500);
const sb = page.getByRole('button', { name: /^(Save|Save changes|Save & publish|Continue)/ }).last(); out.sb = await sb.innerText().catch(() => 'none');
for (let i = 0; i < 3; i++) { const b = page.getByRole('button', { name: /^(Save|Save changes|Save & publish)/ }).last(); if (await b.count()) { await b.click(); await sleep(4000); break; } const c = page.getByRole('button', { name: 'Continue' }).last(); if (await c.count()) { await c.click(); await sleep(3000); } }
out.after = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(-300);
out.net = NET.filter(n => /custom-actions/.test(n.u)).map(n => n.m + ' ' + n.u + ' ' + n.s + ' ' + n.t.slice(0, 150));
return fin({ out });
