const out = {}; const row = page.getByText('Active statues', { exact: true }).first(); const rb = await row.boundingBox();
const state = async () => page.evaluate(() => [...document.querySelectorAll('input[type=checkbox],[role=checkbox]')].filter(c => { const r = c.getBoundingClientRect(); return r.width && r.y > 150 && r.y < 420 && r.x > 1000; }).map(c => (c.checked ?? c.getAttribute('aria-checked')) + ''));
out.before = await state(); await page.mouse.click(rb.x + 10, rb.y + rb.height / 2); await sleep(1000); out.after = await state(); await shot('v27-clicked');
const ab = (await page.getByText('Active statues', { exact: true }).first().boundingBox()); out.sameRowStill = Math.abs(ab.y - rb.y) < 3;
await page.mouse.click(rb.x + 10, rb.y + rb.height / 2); await sleep(800); out.restored = await state();
const save = (await txt()).split('\n').filter(l => /unsaved|Save changes|Discard/i.test(l)).slice(0, 3); out.saveBar = save;
return done(out);
