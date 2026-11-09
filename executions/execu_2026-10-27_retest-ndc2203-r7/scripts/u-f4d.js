const out = {};
await go('/views/all/tickets/e39023b0-4809-4542-872d-8e00c58f1cbb', 10000);
await page.getByText('EN', { exact: true }).first().click(); await sleep(1000);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /العربية/ }).first().click(); await sleep(6000);
const h = page.getByText('السجل', { exact: true }).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); }
await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop = e.scrollHeight; })); await sleep(1200);
await shot('f4-history-b07-ar-ruleran');
const ln = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const i = ln.findIndex(l => /سجل التذكرة/.test(l));
out.tail = ln.slice(i).slice(-14);
await page.getByText('AR', { exact: true }).first().click(); await sleep(1000);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /English/ }).first().click(); await sleep(5000);
out.back = (await txt()).includes('Knowledge Base') ? 'EN' : 'not EN';
return done(out);
