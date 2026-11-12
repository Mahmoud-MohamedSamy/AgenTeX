const o = {}; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5';
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const t = page.getByText('Third question', { exact: false }).first(); await t.scrollIntoViewIfNeeded().catch(() => {}); await sleep(1500);
const tb = await t.boundingBox(); o.tb = tb;
const btns = await page.locator('button').evaluateAll(bs => bs.map((b, i) => { const r = b.getBoundingClientRect(); return { i, x: r.x, y: r.y, w: r.width, txt: (b.innerText || '').trim().slice(0, 20), al: b.getAttribute('aria-label') }; }).filter(b => b.x > 1200 && b.w > 0 && b.w < 40));
const cand = btns.filter(b => tb && b.y < tb.y).sort((a, b) => b.y - a.y)[0]; o.cand = cand;
if (cand) { await page.locator('button').nth(cand.i).click(); await sleep(2500); }
o.menu = (await page.locator('[role=menuitem]').allInnerTexts().catch(() => [])).join(' | ');
o.shotMenu = await shot('../wave2n/r-split-menu3');
const it = page.locator('[role=menuitem]', { hasText: /split/i }).first();
if (await it.count()) { await it.click(); await sleep(3000); o.dialog = (await page.locator('[role=dialog], [role=alertdialog]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 600); o.shotDialog = await shot('../wave2n/r-split-dialog'); }
return done(o);
