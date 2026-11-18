await page.locator('input[type=button][value=Delete], button').filter({ visible: true }).filter({ hasText: /^Delete$/ }).last().click().catch(async () => { await page.getByText('Delete', { exact: true }).last().click(); });
await page.waitForTimeout(4000);
const t = await api(page, 'GET', 'tickets/' + T108); out.t108 = t.s + ' ' + JSON.stringify(t.j && { trashed: t.j.isTrashed }).slice(0, 80);
