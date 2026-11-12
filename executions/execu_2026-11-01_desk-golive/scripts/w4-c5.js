const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 200) + ' => ' + x.t.slice(0, 200));
await go('/community/topics/604d7a0c-6e28-44cc-af76-9d68b1576888', 10000);
await page.getByRole('button', { name: /^Tools/ }).first().click(); await sleep(1500);
out.menu = await page.locator('[role=menuitem], [role=menu] button').allInnerTexts();
const conv = page.locator('[role=menuitem], [role=menu] button').filter({ hasText: /ticket/i }).first(); const n0 = NET.length;
if (await conv.count()) { await conv.click(); await sleep(3000); const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.convDlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); out.convCtrls = await d.locator('button[aria-haspopup],select,input').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.id || '') + '=' + (e.innerText || e.value || '').trim().slice(0, 20))); const dep = d.locator('button[aria-haspopup]').first(); if (await dep.count() && /department/i.test(out.convDlg)) { await dep.click(); await sleep(800); await page.getByRole('option', { name: /^Marketing/ }).first().click().catch(() => {}); } await d.getByRole('button', { name: /^(Convert|Create)/ }).last().click().catch(e => out.cErr = e.message.slice(0, 80)); await sleep(5000); } }
out.convNet = nn(n0); out.msg = (await page.locator('[data-sonner-toast],[role=alert]').allInnerTexts()).join(' / ').slice(0, 200);
await shot('w4/W4-58-converted');
const t = await findT('QA GL W4 agent topic'); out.tk = t.map(d => d.ticket_number + ' ' + d.subject + ' ' + d.channel + ' ' + d.department_id); for (const d of t) CREATED.push({ kind: 'ticket', id: d.id, name: d.ticket_number + ' ' + d.subject });
return fin({ out });
