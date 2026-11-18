const sel = async () => (await body(page)).match(/^.{0,200}?(\d+) Assign To/)?.[1] || '0';
for (let k = 0; k < 3 && (await sel()) !== '0'; k++) { await page.mouse.click(122, 72); await page.waitForTimeout(1200); }
out.cleared = await sel();
for (const y of [133, 203]) { await page.mouse.move(122, y); await page.waitForTimeout(500); await page.mouse.click(122, y); await page.waitForTimeout(900); }
out.selected = await sel(); await shotZ(page, 'list-select3');
