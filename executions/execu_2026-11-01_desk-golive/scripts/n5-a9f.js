const o = {};
await page.mouse.move(1100, 797); await sleep(700);
o.btns = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => { const r = b.getBoundingClientRect(); return r.y > 775 && r.y < 820 && r.x > 960; }).map(b => [Math.round(b.getBoundingClientRect().x), b.getAttribute('aria-label') || b.innerText.trim()]));
const b = o.btns.find(x => /…|\.\.\.|more|option|menu/i.test(x[1])) || o.btns[0];
if (b) { await page.mouse.click(b[0] + 6, 800); await sleep(1500); }
o.menu = await page.$$eval('[role=menuitem], [role=menu] *', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(Boolean))].slice(0, 20));
o.shot = await shot('a9/tavi-status-menu');
return JSON.stringify(o);
