const dlg = async () => (await page.$$eval('[role=dialog], [role=listbox], [role=menu]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 1200)))).filter(t => t && !t.startsWith('CRM New'));
// NDC-1788: field list of the queue filter
await page.locator('main button:has-text("Select a field")').first().click(); await sleep(1200);
out.fieldList = await page.$$eval('[role=option]', es => es.map(e => e.innerText.trim()));
await page.screenshot({ path: RAW + 'wq-filter-fields.png' });
// pick Lead Status = No Answer
const s = page.locator('[role=dialog] input, [role=listbox] input, input[placeholder*="Search"]').last(); await s.fill('Lead Status').catch(() => {}); await sleep(600);
await page.locator('[role=option]:has-text("Lead Status")').first().click().catch(e => out.e1 = String(e.message).slice(0, 80)); await sleep(800);
await page.locator('main button:has-text("Operator")').first().click().catch(e => out.e2 = String(e.message).slice(0, 80)); await sleep(800);
out.ops = await page.$$eval('[role=option], [role=menuitem]', es => es.map(e => e.innerText.trim()));
await page.locator('[role=option]:has-text("is"), [role=menuitem]:has-text("is")').first().click().catch(e => out.e3 = String(e.message).slice(0, 80)); await sleep(1000);
out.afterOp = (await page.innerText('main')).replace(/\s+/g, ' ').match(/EveryLead.{0,400}/)?.[0];
await page.screenshot({ path: RAW + 'wq-filter-applied.png' });
