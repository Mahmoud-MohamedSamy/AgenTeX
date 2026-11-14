await page.getByRole('button', { name: 'Remove Sales' }).click(); await sleep(800);
await page.getByText('Add a department…').click(); await sleep(1500);
out.opts = (await page.locator('[role=option]').allInnerTexts()).slice(0, 8);
await page.getByRole('option', { name: /^Marketing$/ }).first().click(); await sleep(800); await page.keyboard.press('Escape');
const n0 = NET.length; await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000);
out.net = NET.slice(n0).filter(x => /records/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.b.slice(0, 300) + ' => ' + x.t.slice(0, 250));
const m = out.net.join(' ').match(/=> .*?"id":"([0-9a-f-]{36})"/); if (m) { CREATED.push({ kind: 'product', id: m[1], name: 'QA GL W5 Product', mod: PM }); out.pid = m[1]; }
out.url = page.url().replace(H, ''); await shot('w5/W5-60-saved');
return fin({ out });
