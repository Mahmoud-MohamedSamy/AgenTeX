await page.goto(B + '/', { waitUntil: 'domcontentloaded' }); await page.waitForFunction(() => /My Tasks/.test(document.body.innerText), null, { timeout: 60000 }); await sleep(2000);
const dlg = async () => (await page.$$eval('[role=dialog]', es => es.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 900))));
// ?
await page.locator('body').click({ position: { x: 800, y: 600 } }); await page.keyboard.press('Shift+Slash'); await sleep(1000);
out.help = await dlg(); await page.screenshot({ path: RAW + 'sc-help.png' }); await page.keyboard.press('Escape'); await sleep(500);
out.helpClosedByEsc = (await dlg()).length === 0;
// Ctrl+K
await page.keyboard.press('Control+k'); await sleep(1000);
out.palette = await dlg(); await page.screenshot({ path: RAW + 'sc-palette.png' });
await page.keyboard.type('QA R2SC Perf'); await sleep(3500);
out.paletteSearch = await dlg(); await page.screenshot({ path: RAW + 'sc-palette-search.png' });
await page.keyboard.press('Escape'); await sleep(500);
// Ctrl+K toggles closed
await page.keyboard.press('Control+k'); await sleep(600); out.openAgain = (await dlg()).length; await page.keyboard.press('Control+k'); await sleep(600); out.closedByCtrlK = (await dlg()).length === 0;
// Ctrl+\ sidebar
const w0 = await page.evaluate(() => { const a = document.querySelector('aside'); return a ? Math.round(a.getBoundingClientRect().width) : -1; });
await page.keyboard.press('Control+Backslash'); await sleep(800);
const w1 = await page.evaluate(() => { const a = document.querySelector('aside'); return a ? Math.round(a.getBoundingClientRect().width) : -1; });
await page.screenshot({ path: RAW + 'sc-sidebar-collapsed.png' });
await page.keyboard.press('Control+Backslash'); await sleep(800);
const w2 = await page.evaluate(() => { const a = document.querySelector('aside'); return a ? Math.round(a.getBoundingClientRect().width) : -1; });
out.sidebar = [w0, w1, w2];
// shortcuts must not fire while typing in an input
await page.locator('header input, input[placeholder*="Search"]').first().click().catch(() => {}); await page.keyboard.press('Shift+Slash'); await sleep(600);
out.helpWhileTyping = (await dlg()).length;
await page.keyboard.press('Escape');
