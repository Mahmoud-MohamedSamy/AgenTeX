const out = {};
const openHist = async () => { for (let i = 0; i < 4; i++) { const h = page.getByText(/^(History|السجل|التاريخ)$/i).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); return true; } const nx = page.locator('button:right-of(:text("PARENT-CHILD"))').first(); await nx.click().catch(() => {}); await sleep(700); } return false; };
await go('/views/all/tickets/e39023b0-4809-4542-872d-8e00c58f1cbb', 12000); await openHist();
const row = page.getByText('Workflow rule ran', { exact: true }).first(); await row.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); await shot('f4-history-b07-ruleran');
// Arabic: language menu in the top bar
const prefs0 = (await api('GET', '/desk/me/preferences')).j?.data; out.prefLang0 = prefs0?.language || prefs0?.locale || JSON.stringify(prefs0).slice(0, 200);
await page.getByText('EN', { exact: true }).first().click(); await sleep(1200);
out.langOpts = await page.locator('[role=menuitem],[role=option],[role=menuitemradio]').allInnerTexts();
await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /عربي|Arabic|العربية/ }).first().click().catch(e => out.langErr = String(e.message).slice(0, 100)); await sleep(6000);
await openHist(); const rowAr = page.getByText(/قاعدة سير العمل|Workflow rule/).first(); await rowAr.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1000);
await shot('f4-history-b07-ar');
out.ar = (await txt()).split('\n').filter(l => /قاعدة|سير العمل|QA WF|مشاركة|تعليق/.test(l)).slice(0, 14);
return done(out);
