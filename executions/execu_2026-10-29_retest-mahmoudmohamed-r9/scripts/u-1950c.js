// NDC-1950 middle tier (U2, manager of U1): History shows U1's row; "Submitted by" filter lists only U2 + U1; no "Decided by"; pending tabs own only.
await page.goto(H + '/my-requests', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('[role=tab]', { timeout: 120000 }); await sleep(5000);
const out = { tabs: await page.$$eval('[role=tab]', els => els.map(e => e.innerText.replace(/\s+/g, ' ').trim())) };
out.pendingApprovalRows = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').slice(0, 80)).filter(t => /QA RT/.test(t)));
await page.locator('[role=tab]', { hasText: /History/ }).first().click(); await sleep(6000);
out.historyRows = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').slice(0, 140)).filter(t => /QA RT 1950/.test(t)));
out.filters = await page.$$eval('button, select', els => els.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(t => /^(Submitted by|Decided by)$/.test(t)));
const sb = page.locator('button, select', { hasText: /^Submitted by$/ }).first();
if (await sb.count()) { await sb.click(); await sleep(2000); out.submittedByOptions = await page.$$eval('[role=option], [role=menuitemcheckbox], [role=menuitem], label, option', els => els.map(e => e.innerText.trim()).filter(t => t && t.length < 60)).then(a => [...new Set(a)].slice(0, 15)); await shot('1950-7-u2-submitted-by.png'); await page.keyboard.press('Escape'); }
return out;
