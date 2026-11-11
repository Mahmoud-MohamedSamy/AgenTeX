async (page) => { const r = await page.$$eval('button, *', es => es.filter(e => e.offsetParent && e.textContent.trim() === 'Delete' && (e.tagName === 'BUTTON' || e.childElementCount === 0)).map(e => { const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2, e.tagName]; }));
 const btn = r.find(x => x[2] === 'BUTTON') || r[r.length - 1]; await page.mouse.click(btn[0], btn[1]); await page.waitForTimeout(6000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-after-delete.png'});
 const t = await page.innerText('body'); return { r, url: page.url(), tabs: (t.match(/(\d+ )?CONVERSATION[\s\S]{0,120}/) || [''])[0] }; }
