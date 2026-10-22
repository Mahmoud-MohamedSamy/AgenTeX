await page.locator('[role=dialog]').getByRole('button', { name: 'Cancel' }).click(); await sleep(1500);
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const lays = (await api('GET', `/modules/${L}/layouts`)).j.data.map(l => l.name + ' active=' + (l.isActive ?? l.is_active ?? l.status) + (l.isDefault ? ' DEFAULT' : ''));
const row = page.locator('tr').filter({ hasText: 'Test Layout 1' }).first();
const html = (await row.innerHTML()).replace(/<svg[\s\S]*?<\/svg>/g, '').slice(0, 1500);
return done({ lays, html });
