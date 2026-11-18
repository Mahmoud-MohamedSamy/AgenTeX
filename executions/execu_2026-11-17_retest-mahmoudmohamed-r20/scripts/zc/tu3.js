await page.goto(H + '/modules/0924eb24-e42a-4eab-8efd-e3428f19e882/records/00645a02-40cc-4a7e-9f8d-4a1446829857', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if (/QA RT20 ZC Contract 2841/.test(await text())) break; } await sleep(3000);
await page.getByText('Department', { exact: true }).first().scrollIntoViewIfNeeded().catch(() => {}); await sleep(800);
const v = page.getByText('QA RT19 SLA Dept B', { exact: true }).first(); const bb = await v.boundingBox();
await page.mouse.move(bb.x + 60, bb.y + 8); await sleep(1000); await shot('ZC-2841-tavi-4-hover-dept.png');
await page.mouse.click(bb.x + 60, bb.y + 8); await sleep(2000); await shot('ZC-2841-tavi-5-click-dept.png');
const opts = await page.locator('[role=option]').allInnerTexts(); const inputs = await page.locator('input:visible, [role=combobox]:visible').count();
await page.keyboard.press('Escape'); await sleep(800);
return { bb, opts: opts.slice(0, 10), inputs };
