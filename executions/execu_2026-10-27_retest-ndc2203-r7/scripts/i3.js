const out = {}; const id = '4ad6ef9a-2588-4557-b814-18f801e0a438';
const openHist = async (re) => { for (let i = 0; i < 4; i++) { const h = page.getByText(re).first(); if (await h.isVisible().catch(() => false)) { await h.click(); await sleep(4000); return true; } const nx = page.locator('button:right-of(:text("PARENT-CHILD"))').first(); await nx.click().catch(() => {}); await sleep(700); } return false; };
const toBottom = async () => { await page.evaluate(() => document.querySelectorAll('*').forEach(e => { if (e.scrollHeight > e.clientHeight + 50 && getComputedStyle(e).overflowY.match(/auto|scroll/)) e.scrollTop = e.scrollHeight; })); await sleep(1200); };
await go('/views/all/tickets/' + id, 12000); await openHist(/^History$/i); await toBottom(); await shot('i3-657-history-en');
const ln = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const i = ln.findIndex(l => l === 'Department changed'); out.en = ln.slice(i - 1, i + 9); out.num = ln.find(l => /^#\d+$/.test(l));
// boxes for annotation
const box = async t => { const b = await page.getByText(t, { exact: true }).first().boundingBox().catch(() => null); return b && [Math.round(b.x), Math.round(b.y), Math.round(b.x + b.width), Math.round(b.y + b.height)]; };
out.boxEn = { title: await box('Department changed'), val: await box('7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'), field: await box('department_id') };
await page.getByText('EN', { exact: true }).first().click(); await sleep(1000); await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /العربية/ }).first().click(); await sleep(6000);
await openHist(/^السجل$/); await toBottom(); await shot('i3-657-history-ar');
const la = (await txt()).split('\n').map(l => l.trim()).filter(Boolean); const j = la.findIndex(l => l === 'department_id'); out.ar = la.slice(j - 2, j + 6);
out.boxAr = { val: await box('7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'), field: await box('department_id') };
await page.getByText('AR', { exact: true }).first().click(); await sleep(1000); await page.locator('[role=menuitem],[role=option],[role=menuitemradio]', { hasText: /English/ }).first().click(); await sleep(5000);
out.back = (await txt()).includes('Knowledge Base') ? 'EN' : 'not EN';
return done(out);
