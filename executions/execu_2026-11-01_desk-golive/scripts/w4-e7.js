await go('/views/all/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e', 8000); await page.getByText('Mahmoud Mohamed').first().waitFor({ timeout: 40000 }).catch(() => {}); await sleep(2000);
out.bp = (await page.locator('main').last().innerText()).replace(/\s+/g, ' ').match(/(blueprint[^.]{0,80}|Tickets from Mail[^ ]*)/i)?.[0] || 'none';
const n0 = NET.length;
await page.getByRole('button', { name: /^Close ticket$/i }).last().click().catch(e => out.e = e.message.slice(0, 80)); await sleep(3000);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await shot('w4/W4-73-close-dialog'); await d.getByRole('button', { name: /^(Close|Close ticket|Confirm|Save|Yes)/i }).last().click().catch(e => out.e2 = e.message.slice(0, 80)); await sleep(5000); }
out.net = NET.slice(n0).filter(x => x.m !== 'GET' && !/heartbeat|resolved|realtime/.test(x.u)).map(x => x.m + ' ' + x.u.split('/').slice(-3).join('/') + ' ' + x.s + ' ' + x.t.slice(0, 150));
out.status = flat(D((await api('GET', '/modules/' + TM + '/records/6f9037a0-15b3-4f21-a584-2e21b3b5259e')).j) || {}).status;
const hs = await api('GET', '/desk/happiness/settings'); out.happy = JSON.stringify(D(hs.j)).slice(0, 400);
await shot('w4/W4-73-closed');
return fin({ out });
