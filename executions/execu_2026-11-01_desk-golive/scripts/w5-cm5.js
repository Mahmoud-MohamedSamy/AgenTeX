const MID = '01f7df91-4300-495f-ae3e-5de49189195a';
await page.getByText('Delete', { exact: true }).last().click(); await sleep(2000);
const cd = page.locator('[role=alertdialog], [role=dialog]').last(); out.conf = (await cd.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w5/W5-51-delete-confirm');
const inp = cd.locator('input'); out.inputs = await inp.count(); if (out.inputs) { await inp.first().fill('QA GL W5 Modules'); await sleep(500); }
const n0 = NET.length; await cd.getByRole('button', { name: /Delete/ }).last().click().catch(e => out.dErr = e.message.slice(0, 60)); await sleep(5000);
out.del = NET.slice(n0).filter(x => !/heartbeat/.test(x.u)).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
out.after = (await api('GET', '/modules/' + MID + '/records?limit=1')).s; out.listed = (await mtxt()).includes('QA GL W5 Modules');
return fin({ out });
