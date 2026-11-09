await page.goto(B + '/workqueue', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => /My Open Activities/.test(document.body.innerText) && /Rows per page/.test(document.body.innerText), null, { timeout: 60000 });
await sleep(3000);
out.text = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 1200);
out.buttons = await page.$$eval('main button, main [role=button], main select', es => es.map(e => (e.getAttribute('aria-label') || e.getAttribute('title') || e.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean));
// date filter options in My Open Activities
const dd = page.locator('main button:has-text("All open"), main select').first();
await dd.click().catch(() => {}); await sleep(800);
out.dateOptions = await page.$$eval('[role=option], [role=menuitem], option', es => es.map(e => e.innerText.trim()).filter(Boolean));
await page.screenshot({ path: RAW + 'wq-date-options.png' });
await page.keyboard.press('Escape');
