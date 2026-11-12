const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 300) + ' => ' + x.t.slice(0, 300));
out.settings = JSON.stringify(D((await api('GET', '/desk/kb/settings')).j)).slice(0, 600);
await go('/knowledge-base', 12000);
let n0 = NET.length;
await page.getByRole('button', { name: /^Manage categories/ }).first().click().catch(() => page.getByText('Manage categories').first().click()); await sleep(4000);
out.mcUrl = page.url().replace(H, ''); out.mc = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').slice(0, 700);
const nb = page.getByRole('button', { name: /^(New|Add|Create) (root )?categor/i }).first(); out.hasNew = await nb.count();
if (out.hasNew) { await nb.click(); await sleep(2500); const d = page.locator('[role=dialog]').last(); out.dlg = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 800); out.dctrl = await d.locator('input,textarea,select,button[aria-haspopup],[role=switch],[role=radio]').evaluateAll(es => es.map(e => [e.tagName, e.id, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || '', (e.innerText || e.value || '').trim().slice(0, 25)].join('|'))).catch(() => []); await shot('w4/W4-60-new-cat'); }
return fin({ out });
