const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
await page.goto(H + `/settings/modules-and-fields/${M}/layouts/${L}`, { waitUntil: 'domcontentloaded' }); await sleep(8000);
const res = {};
// drag a new Lookup field into the section
const src = page.locator('aside, div', { hasText: /^Lookup$/ }).locator('xpath=self::*').last();
const s = page.locator('text=/^Lookup$/').first(); const b = await s.boundingBox(); res.src = b;
const sec = await page.locator('text=Basic Information').first().boundingBox();
await page.mouse.move(b.x + 10, b.y + b.height / 2); await page.mouse.down();
await page.mouse.move(b.x + 40, b.y + 20, { steps: 5 }); await page.mouse.move(700, sec.y + 140, { steps: 20 }); await sleep(300); await page.mouse.move(710, sec.y + 150, { steps: 5 }); await sleep(300);
await page.mouse.up(); await sleep(2500);
await shot('lb-new-lookup');
res.dlg = (await page.locator('[role=dialog]').count()) ? (await page.locator('[role=dialog]').first().innerText()).replace(/\s+/g, ' ').slice(0, 1500) : 'no dialog';
res.inputs = await page.$$eval('[role=dialog] input', is => is.map(i => (i.getAttribute('aria-label') || i.placeholder || i.name || '') + '=' + i.value + (i.readOnly ? ' (ro)' : '') + (i.disabled ? ' (disabled)' : '')));
return res;
