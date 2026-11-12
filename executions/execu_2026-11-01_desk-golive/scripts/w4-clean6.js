await go('/settings/organization/email-templates', 10000);
const rows = page.locator('tr').filter({ hasText: /^Reply acknowledgement/ }); out.rows = (await page.locator('tr').filter({ hasText: 'Reply acknowledgement' }).allInnerTexts()).map(s => s.replace(/\s+/g, ' ').slice(0, 140));
const row = page.locator('tr').filter({ hasText: 'Reply acknowledgement' }).filter({ hasNotText: 'QA GL W4' }).first();
await row.getByRole('button', { name: /^Actions for/ }).click(); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText()).replace(/\s+/g, ' ');
const n0 = NET.length;
await page.getByRole('menuitem', { name: /^Activate/ }).click(); await sleep(2500);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); if (await d.count()) { out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 500); await shot('w4/clean-activate-builtin'); }
return fin({ out });
