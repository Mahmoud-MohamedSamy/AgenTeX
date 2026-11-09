await page.click('button[aria-label="Criteria field"]'); await sleep(1500);
out.fieldMenu = (await page.$$eval('[role=listbox] [role=option], [role=menu] [role=menuitem], [cmdk-item], [role=option]', es => es.map(e => e.innerText.trim()))).slice(0, 30);
const search = page.locator('[role=dialog] input, [role=listbox] input, [cmdk-input], input[placeholder*="Search"]').last();
await search.fill('Full Name').catch(() => {}); await sleep(800);
await page.locator('[role=option]:has-text("Full Name")').first().click().catch(e => out.e1 = String(e.message).slice(0, 100)); await sleep(800);
await page.click('button[aria-label^="Operator for"]').catch(e => out.e2 = String(e.message).slice(0, 100)); await sleep(800);
out.ops = (await page.$$eval('[role=option], [role=menuitem]', es => es.map(e => e.innerText.trim()))).slice(0, 20);
await page.locator('[role=option]:has-text("starts with"), [role=menuitem]:has-text("starts with")').first().click().catch(e => out.e3 = String(e.message).slice(0, 100)); await sleep(800);
const val = page.locator('main input[type=text], main input:not([type])').last(); await val.fill('QA R2SC MD');
await page.screenshot({ path: RAW + 'md-criteria.png' });
const reqs = []; const h = q => { if (q.url().includes('/api/v1/') && q.method() !== 'GET') reqs.push(q.method() + ' ' + q.url().split('/api/v1')[1].slice(0, 80) + ' ' + (q.postData() || '').slice(0, 400)); };
page.on('request', h);
await page.click('main button:has-text("Search")'); 
for (let i = 0; i < 40; i++) { await sleep(1000); if (/QA R2SC MD/.test(await page.innerText('main'))) break; }
await sleep(2000);
out.preview = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 1500);
await page.screenshot({ path: RAW + 'md-preview.png' });
page.off('request', h); out.reqs = reqs;
