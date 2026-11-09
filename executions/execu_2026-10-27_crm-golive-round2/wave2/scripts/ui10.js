const H = 'https://staging-crm.taviportal.com', LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const wait = ms => page.waitForTimeout(ms);
const lid = '7d5c8192-3680-48f1-ac20-ba98383fc42e';
await page.goto(H + `/modules/${LEADS}/records/${lid}/convert`, { waitUntil: 'domcontentloaded' }); await page.waitForSelector('text=Create a new Transactions', { timeout: 40000 });
await page.getByText('Create a new Transactions', { exact: false }).click(); await wait(25000);
const sec = page.locator('div', { hasText: 'Create a new Transactions' }).last();
out.dealSection = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Create a new Transactions.{0,600}/)?.[0];
out.inputsAfterTick = await page.$$eval('main input, main textarea, main select, main [role=combobox]', es => es.map(e => (e.getAttribute('aria-label') || e.name || e.placeholder || e.type || '').slice(0, 30) + (e.disabled || e.readOnly ? ' [ro]' : '')));
await page.screenshot({ path: RAW + 'convert-deal-fields-25s.png', fullPage: true });
await page.goto(H + '/workqueue', { waitUntil: 'domcontentloaded' }); const t0 = Date.now();
try { await page.waitForFunction(() => !/Loading your work queue/.test(document.body.innerText), null, { timeout: 60000 }); } catch (e) {}
out.wqSeconds = (Date.now() - t0) / 1000; out.wq = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 600);
await page.screenshot({ path: RAW + 'work-queue-page.png' });
