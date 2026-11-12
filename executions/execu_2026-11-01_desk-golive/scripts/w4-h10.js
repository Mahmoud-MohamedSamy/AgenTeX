await go('/settings/channels/help-center/rebranding', 14000);
const n0 = NET.length;
await page.getByRole('button', { name: /^Publish$/ }).first().click(); await sleep(2500);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /^Publish/ }).last().click(); await sleep(4000); }
out.net = NET.slice(n0).filter(x => !/heartbeat|resolved|realtime|email-preview/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s);
out.name = arr(D((await api('GET', '/help-centers')).j))[0].name;
return fin({ out });
