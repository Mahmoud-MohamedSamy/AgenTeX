const ID = '98ab10b1-ac40-4d5f-919b-0c4e11360b82';
const br = () => page.locator('tr, [role=row]').filter({ hasText: 'QA GL W5 Delete me' }).first();
await br().getByRole('button', { name: 'Item actions' }).click(); await sleep(1200); out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await page.getByRole('menuitem', { name: /Restore/ }).click(); await sleep(1500); const c1 = page.locator('[role=alertdialog], [role=dialog]').last(); if (await c1.count()) { out.c1 = (await c1.innerText()).replace(/\s+/g, ' ').slice(0, 200); await c1.getByRole('button', { name: /Restore/ }).last().click().catch(() => {}); } await sleep(4000);
out.afterRestore = (await api('GET', '/modules/' + CM + '/records/' + ID)).s;
// delete again via API-equivalent screen path: list delete
await go('/modules/' + CM, 10000);
const row = page.locator('[role=row], tr, li').filter({ hasText: 'QA GL W5 Delete me' }).first(); await row.getByRole('button', { name: 'Delete' }).click(); await sleep(1200);
await page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button', { name: /^Delete$/ }).click(); await sleep(3000);
await go('/settings/data/recycle-bin', 10000);
await br().getByRole('button', { name: 'Item actions' }).click(); await sleep(1200);
await page.getByRole('menuitem', { name: /Delete permanently|Delete forever|Permanently/i }).click().catch(e => out.pErr = e.message.slice(0, 60)); await sleep(1500);
const c2 = page.locator('[role=alertdialog], [role=dialog]').last(); out.c2 = (await c2.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 250); await shot('w5/W5-45-purge-confirm');
const n0 = NET.length; await c2.getByRole('button', { name: /Delete/ }).last().click().catch(e => out.c2Err = e.message.slice(0, 60)); await sleep(4000);
out.net = NET.slice(n0).map(x => x.m + ' ' + x.u.split('?')[0] + ' ' + x.s);
out.stillInBin = await br().count(); await shot('w5/W5-45-after');
return fin({ out });
