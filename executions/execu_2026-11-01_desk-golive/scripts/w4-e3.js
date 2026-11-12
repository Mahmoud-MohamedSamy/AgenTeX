await go('/views/all/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e', 8000); await page.getByText('Mahmoud Mohamed').first().waitFor({ timeout: 40000 }).catch(() => {}); await sleep(2000);
await page.getByRole('button', { name: /^Reply All$/ }).first().click(); await sleep(3500);
await page.getByRole('button', { name: 'Insert template' }).click(); await sleep(3000);
const pop = page.locator('[role=dialog],[role=menu],[role=listbox],[data-radix-popper-content-wrapper]').last();
out.picker = (await pop.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
await shot('w4/W4-25-picker');
await pop.getByText('QA GL W4 template', { exact: true }).first().click().catch(e => out.pe = e.message.slice(0, 80)); await sleep(3000);
const cdlg = page.locator('[role=alertdialog],[role=dialog]').last(); if (await cdlg.count() && /replace|insert/i.test(await cdlg.innerText().catch(() => ''))) { out.confirm = (await cdlg.innerText()).replace(/\s+/g, ' ').slice(0, 200); await cdlg.getByRole('button', { name: /replace|insert|ok|continue/i }).last().click().catch(() => {}); await sleep(2500); }
const ed = page.locator('[contenteditable=true]').last(); out.editor = (await ed.innerText().catch(() => '')).slice(0, 400);
out.subject = await page.locator('input[name=subject], input[placeholder*=ubject]').first().inputValue().catch(() => 'n/a');
out.leftBraces = /\{\{/.test(out.editor + out.subject);
await shot('w4/W4-25-inserted');
const n0 = NET.length; await page.getByRole('button', { name: /^Send$/ }).click(); await sleep(7000);
out.send = NET.slice(n0).filter(x => /replies|drafts/.test(x.u) && x.m !== 'GET').map(x => x.m + ' ' + x.u.split('/').slice(-2).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 160));
const rp = await api('GET', '/desk/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e/replies'); out.stored = arr(D(rp.j)).filter(x => x.mode).map(x => ({ st: x.status, from: x.from || x.from_address, subj: x.subject, body: String(x.body_html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300) }));
return fin({ out });
