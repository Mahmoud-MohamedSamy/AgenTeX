await go('/settings/channels/help-center/users', 10000);
const click = async name => { await page.getByRole('button', { name: 'Open QA GL W5R Contact' }).click(); await sleep(3000); const n0 = NET.length; await page.getByRole('button', { name }).last().click(); await sleep(1500); const d = page.locator('[role=alertdialog],[role=dialog]').last(); const dt = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 250); await d.getByRole('button', { name: new RegExp('^(' + name.split(' ')[0] + '|Confirm|Yes)', 'i') }).last().click().catch(() => {}); await sleep(5000); return { dt, net: NET.slice(n0).filter(x => x.m !== 'GET').map(x => x.m + ' ' + x.u.replace(/^https:\/\/[^/]+/, '').slice(0, 90) + ' ' + x.s + ' ' + x.t.slice(0, 150)) }; };
out.revoke = await click('Revoke invitation'); await shot('w5r/W5-08-revoked');
await go('/settings/channels/help-center/users', 10000); out.after = (await mtxt()).slice(0, 400);
if (/qa-gl-w5r-c1/.test(out.after)) { out.del = await click('Delete'); await go('/settings/channels/help-center/users', 10000); out.after2 = (await mtxt()).slice(0, 300); }
return fin({ out });
