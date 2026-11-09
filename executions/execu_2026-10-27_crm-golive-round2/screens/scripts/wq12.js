await page.locator('[role=dialog] button:has-text("Criteria")').first().click(); await sleep(1500);
await page.locator('[role=dialog] button:has-text("Select a field")').first().click(); await sleep(1200);
out.fields = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim()));
await page.screenshot({ path: RAW + 'wq-create-fields.png' });
// Leads lookup fields from the API
const f = await api('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288');
out.layoutStatus = f.s;
const txt = f.t; out.lookupHints = (txt.match(/"datatype(Key)?":"[a-z_]*lookup[a-z_]*"/gi) || []).slice(0, 5);
