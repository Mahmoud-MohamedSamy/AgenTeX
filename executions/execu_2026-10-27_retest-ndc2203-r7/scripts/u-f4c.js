const out = {};
await go('/views/all/tickets/e39023b0-4809-4542-872d-8e00c58f1cbb', 12000);
const h = page.getByText('السجل', { exact: true }).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); }
const ln = (await txt()).split('\n'); const i = ln.findIndex(l => /تم تشغيل قاعدة|قاعدة سير العمل/.test(l) && !/بواسطة/.test(l));
out.rowAr = ln.slice(Math.max(0, i - 1), i + 9);
const el = page.getByText(ln[i] || 'zzz', { exact: true }).first(); await el.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('f4-history-b07-ar-ruleran');
await page.getByText('AR', { exact: true }).first().click(); await sleep(1200);
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /English/ }).first().click().catch(e => out.backErr = String(e.message).slice(0, 100)); await sleep(5000);
out.back = (await txt()).includes('Knowledge Base') ? 'EN' : 'not EN';
return done(out);
