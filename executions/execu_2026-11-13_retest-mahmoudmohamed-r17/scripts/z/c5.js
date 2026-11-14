async (page) => { await page.mouse.click(1555, 80); await page.waitForTimeout(1500);
 const items = page.locator('li').filter({ hasText: 'Delete' }); const n = await items.count(); let clicked = false;
 for (let i = 0; i < n; i++) { const it = items.nth(i); if (await it.isVisible() && (await it.innerText()).trim() === 'Delete') { const bb = await it.boundingBox(); await page.screenshot({path:'../screenshots/raw/zoho-2635-task-more.png'}); await page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2); clicked = true; break; } }
 await page.waitForTimeout(2000); await page.screenshot({path:'../screenshots/raw/zoho-2635-task-delete-confirm.png'});
 const t = await page.innerText('body'); const i = t.search(/sure|recycle|delete this/i); return { n, clicked, confirm: i >= 0 ? t.slice(Math.max(0, i - 150), i + 250) : '' }; }
