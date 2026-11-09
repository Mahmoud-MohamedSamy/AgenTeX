const o = {}; await page.keyboard.press('Escape'); await sleep(500);
const lab = page.locator('text=/^QA NDC TKT number$/').last(); await lab.scrollIntoViewIfNeeded().catch(() => {}); const box = await lab.boundingBox().catch(() => null);
await page.mouse.move(box.x + 200, box.y + 8); await sleep(700);
const b = await page.evaluate(y => [...document.querySelectorAll('button[aria-label="Field options"]')].map(b => { const r = b.getBoundingClientRect(); return [r.x, r.y]; }).filter(p => Math.abs(p[1] - y) < 25)[0], box.y);
o.b = b; await page.mouse.click(b[0] + 6, b[1] + 6); await sleep(1500);
const mr = page.getByText('Mark as Required', { exact: true }).first(); o.mr = await mr.count(); o.vis = o.mr ? await mr.isVisible() : false;
if (o.vis) { await mr.click(); await sleep(1500); }
o.marked = await shot('rt/2791-fly-marked');
const sv = page.locator('button', { hasText: /^Save$/ }).last(); o.dis = await sv.isDisabled().catch(() => null); if (!o.dis) { await sv.click().catch(e => o.e = e.message.slice(0, 50)); await sleep(5000); }
o.after = (await txt()).replace(/\s+/g, ' ').match(/.{0,60}(saved|Saved|error|Error).{0,60}/)?.[0];
o.saved = await shot('rt/2791-fly-saved');
return JSON.stringify(o);
