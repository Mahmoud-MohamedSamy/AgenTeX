const d = page.locator('[role=dialog]').last();
await d.getByRole('button', { name: 'Choose a field' }).click(); await sleep(1500);
out.fields = (await page.locator('[role=listbox], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
await page.getByRole('option', { name: /^Priority$/ }).first().click(); await sleep(1500);
out.ctl = await d.locator('button, select, input').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.placeholder || '').trim().slice(0, 30)));
const vb = d.getByRole('button', { name: /Select|Choose a value|value/i }).first(); if (await vb.count()) { await vb.click(); await sleep(1200); await page.getByRole('option', { name: /^Medium$/i }).first().click().catch(e => out.vErr = e.message.slice(0, 50)); }
else { const sel = d.locator('select').last(); if (await sel.count()) await sel.selectOption({ label: 'Medium' }).catch(e => out.sErr = e.message.slice(0, 50)); }
await sleep(800); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-44-update-filled');
const n0 = NET.length; await d.getByRole('button', { name: 'Update records' }).click(); await sleep(6000);
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 160));
await go('/settings/data/bulk-actions', 10000);
out.log = (await page.locator('body').innerText()).replace(/\s+/g, ' ').replace(/.*Failed Status /, '').slice(0, 250); await shot('w5/W5-44-log');
return fin({ out });
