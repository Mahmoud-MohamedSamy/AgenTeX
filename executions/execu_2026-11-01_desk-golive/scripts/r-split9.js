const o = {}; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5', M = '5a81c313-93e3-4b0b-9893-769cfe2c1eff';
await page.keyboard.press('Escape'); await sleep(800);
await page.mouse.click(1249, 117); await sleep(2500);
o.ticketMenu = (await page.locator('[role=menuitem]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 600);
o.shot = await shot('../wave2n/r-split-ticketmenu'); await page.keyboard.press('Escape');
const b = await page.evaluate(() => [...document.querySelectorAll('script[src]')].map(s => s.src));
o.bundleHits = [];
for (const src of b) { const t = await (await fetch(src)).text().catch(() => ''); const m = t.match(/.{0,80}split.{0,80}/gi) || []; o.bundleHits.push(...m.filter(x => /ticket|repl|message|thread/i.test(x)).slice(0, 12)); }
for (const [p, body] of [[`/desk/tickets/${TK}/replies/${M}/split`, {}], [`/desk/tickets/${TK}/messages/${M}/split`, {}], [`/desk/tickets/${TK}/split`, { reply_id: M }]]) { const r = await api('POST', p, body); o['POST ' + p.replace(TK, 'T').replace(M, 'M')] = r.s + ' ' + r.t.slice(0, 300); if (r.s < 300) break; }
return done(o);
