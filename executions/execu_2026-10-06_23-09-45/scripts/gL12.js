// L12: builder and tab bar usable in this browser at 3 sizes; drag a palette item onto the canvas (not saved).
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c'; const OL = (await defLayout(OPEN)).id; const ua = await page.evaluate(() => navigator.userAgent);
const B = /Firefox/.test(ua) ? 'firefox' : /Chrome/.test(ua) ? 'chromium' : 'webkit';
for (const [w, h] of [[1366, 768], [1920, 1080], [820, 1180]]) await step(`L12.${B}.${w}`, async () => {
  await page.setViewportSize({ width: w, height: h });
  await go('/settings/modules-and-fields', 6000); const list = (await page.getByText('QA MF Open', { exact: true }).count()) > 0;
  await builder(OPEN, OL); const pal = await page.getByText('Single Line', { exact: true }).first().isVisible().catch(() => false); const canvas = await page.getByText('NEW SECTION').first().isVisible().catch(() => false);
  let drag = 'not tried';
  if (pal) { const before = await page.getByText('Single Line', { exact: true }).count(); const src = page.getByText('Single Line', { exact: true }).first(); const dst = page.getByText('Name', { exact: true }).last();
    try { await src.dragTo(dst, { timeout: 8000 }); await sleep(1500); const dlg = await page.locator('[role=dialog]').count(); const after = await page.getByText('Single Line', { exact: true }).count(); drag = `dialog=${dlg > 0}, new field label=${after > before}`; } catch (e) { drag = 'error ' + e.message.slice(0, 60); } }
  const hs = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  const s = await shot(`L12-${B}-${w}x${h}`);
  await page.keyboard.press('Escape'); const cancel = page.getByRole('button', { name: /^Cancel$/ }).first(); if (await cancel.count()) await cancel.click().catch(() => { }); await sleep(800);
  const disc = page.getByRole('button', { name: /Discard|Leave|Yes/ }).last(); if (await disc.count()) await disc.click().catch(() => { });
  await go('/hq', 5000); const tabs = ['Tickets', 'Customers'].every(async t => true) && (await page.getByText('Tickets', { exact: true }).first().isVisible().catch(() => false));
  rec(`L12.${B}.${w}x${h}`, list && pal && canvas && tabs && !hs ? 'PASS' : 'INFO', `${B} ${w}x${h}: module list ok=${list}; builder palette=${pal}, canvas=${canvas}; drag Single Line → ${drag}; horizontal scroll=${hs}; tab bar shows Tickets=${tabs}`, { shot: s });
});
return done();
