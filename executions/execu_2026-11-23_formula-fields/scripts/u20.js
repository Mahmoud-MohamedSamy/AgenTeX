// I4 search
await page.goto(H + `/modules/${made.mod}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 25; i++) { await sleep(2000); if (/QA FX/.test(await text('main'))) break; }
const inputs = await page.locator('main input').evaluateAll(xs => xs.map(x => x.placeholder).filter(Boolean)); log('list inputs', inputs);
const s = page.locator('main input[placeholder*="Search" i]').first();
if (await s.count()) { await s.fill('High value'); await s.press('Enter'); await sleep(5000); const t = await text('main'); log('I4 found D1 by formula text', /QA FX D1/.test(t), '| rows shown', (t.match(/QA FX [A-Z0-9]+ r\d/g) || []).slice(0, 6)); await shot('I4-search'); await s.fill('QA FX D1'); await s.press('Enter'); await sleep(4000); log('control search by name finds D1', /QA FX D1/.test(await text('main'))); }
// A12 quick create
const nb = page.getByRole('button', { name: /^New$/ }).first(); await nb.click().catch(() => { }); await sleep(2000); const items = await page.getByRole('menuitem').allInnerTexts().catch(() => []); log('new menu', items.slice(0, 15));
const qc = page.getByRole('menuitem').filter({ hasText: /^QA FX$/ }).first(); if (await qc.count()) { await qc.click(); await sleep(3000); const d = await page.locator('[role=dialog]').allInnerTexts(); log('A12 quick create has formula', /QA FX UI Double/i.test(d.join(' ')), /Computed after save/.test(d.join(' '))); await shot('A12-quick-create'); await page.keyboard.press('Escape'); }
// M4 keyboard in the builder
await page.goto(H + `/settings/modules-and-fields/${made.mod}/layouts/${made.layouts[0]}`, { waitUntil: 'domcontentloaded' }); for (let i = 0; i < 40; i++) { await sleep(2000); if (/QA FX Inputs/.test(await text())) break; } await sleep(1500);
const sb = await page.getByText('Formula', { exact: true }).first().boundingBox(); const tb = await page.getByText('QA Text2', { exact: true }).first().boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + (tb.x + 200 - sb.x) * i / 25, sb.y + (tb.y + 10 - sb.y) * i / 25); await sleep(40); } await sleep(400); await page.mouse.up(); await sleep(2500);
await page.locator('#formula-expression').focus(); await page.keyboard.type('qa_num + '); const seq = [];
for (let i = 0; i < 4; i++) { await page.keyboard.press('Tab'); await sleep(200); seq.push(await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return (a.innerText || a.getAttribute('aria-label') || a.tagName).trim().slice(0, 20) + (cs.outlineStyle !== 'none' || cs.boxShadow !== 'none' ? ' [focus ring]' : ' [no ring]'); })); }
await page.keyboard.press('Enter'); await sleep(400); log('M4 tab order', seq, 'expression after Enter on focused chip', await page.locator('#formula-expression').inputValue()); await shot('M4-keyboard');
log('M5 aria', await page.locator('#formula-expression').evaluate(e => ({ invalid: e.getAttribute('aria-invalid'), describedby: e.getAttribute('aria-describedby'), label: !!document.querySelector('label[for="formula-expression"]') })));
