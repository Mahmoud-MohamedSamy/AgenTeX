await go('/modules/' + CM + '/customers/' + C1, 12000);
const mb = page.locator('main').getByRole('button', { name: /^(More|More actions|Record actions|Actions)$/i }).first(); out.mbName = await mb.getAttribute('aria-label').catch(() => null);
await mb.click(); await sleep(1200); await page.getByRole('menuitem', { name: 'Invite to Help Center' }).click(); await sleep(2000);
const d = page.locator('[role=dialog], [role=alertdialog]').last(); out.dlg = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w5/W5-08-invite');
const n0 = NET.length; const b = d.getByRole('button', { name: /Invite|Send/ }).last(); if (await b.count()) { await b.click(); await sleep(4000); }
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s + ' ' + x.t.slice(0, 200));
out.toast = (await page.locator('[role=status], [data-sonner-toast]').allInnerTexts().catch(() => [])).join(' | ');
await mb.click(); await sleep(1200); out.menuAfter = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('w5/W5-08-menu-after'); await page.keyboard.press('Escape');
return fin({ out });
