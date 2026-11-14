await go('/modules/88e8ea44-1658-4df3-9930-d0902b91073d', 12000);
await page.locator('main').getByText('QA GL W5 ticket for contact 1', { exact: true }).first().click(); await sleep(9000);
out.url = page.url().replace(H, ''); out.has = (await page.locator('body').innerText()).includes('QA GL W5 Product');
await shot('w5/W5-60-ticket-product');
// delete product (screen): product list row delete
await go('/settings/organization/products', 10000);
const row = page.locator('tr, [role=row]').filter({ hasText: 'QA GL W5 Product' }).first(); out.rowBtns = await row.getByRole('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(Boolean));
return fin({ out });
