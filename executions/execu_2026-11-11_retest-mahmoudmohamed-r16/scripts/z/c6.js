async (page) => { const was = await page.$$eval('*', es => es.filter(e => e.offsetParent && e.childElementCount === 0 && e.textContent.trim() === 'Delete').length);
 if (!was) { await page.mouse.click(1555, 80); await page.waitForTimeout(1500); }
 await page.screenshot({path:'../screenshots/raw/zoho-2635-task-more.png'});
 const r = await page.$$eval('*', es => es.filter(e => e.offsetParent && e.childElementCount === 0 && e.textContent.trim() === 'Delete').map(e => { const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2, e.tagName]; }));
 if (r.length) { await page.mouse.click(r[0][0], r[0][1]); await page.waitForTimeout(2000); }
 await page.screenshot({path:'../screenshots/raw/zoho-2635-task-delete-confirm.png'});
 const t = await page.innerText('body'); const i = t.search(/sure|recycle|delete this/i); return { was, r, confirm: i >= 0 ? t.slice(Math.max(0, i - 150), i + 250) : '' }; }
