const o = { polls: [] }; const TK = '47dc8f0e-9c3a-49d4-9cbc-025a3ece15a5';
let inb;
for (let i = 0; i < 1; i++) { const l = await api('GET', `/desk/tickets/${TK}/replies`); const ms = arr(l.j && l.j.data); inb = ms.filter(m => m.direction === 'inbound' && m.id !== '5a81c313-93e3-4b0b-9893-769cfe2c1eff').pop(); o.polls.push([new Date().toISOString().slice(11, 19), ms.length]); if (inb) break; await sleep(25000); }
if (!inb) { const n = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?limit=5&sort=-created_at'); o.newest = arr(n.j && n.j.data).map(fl).map(x => [x.id, x.ticket_number, x.subject]); return done(o); }
o.inbound = [inb.id, inb.subject, (inb.body_text || '').slice(0, 200), inb.created_at];
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000);
const card = page.locator('text=Third question').first(); o.cardSeen = await card.count();
await card.scrollIntoViewIfNeeded().catch(() => {});
const btn = card.locator('xpath=ancestor::*[.//button][1]').locator('button').last(); await btn.click().catch(e => o.e1 = String(e).slice(0, 120)); await sleep(2500);
o.menu = (await page.locator('[role=menuitem]').allInnerTexts().catch(() => [])).join(' | ');
o.shotMenu = await shot('../wave2n/r-split-menu2');
const it = page.locator('[role=menuitem]', { hasText: /split/i }).first();
if (await it.count()) { await it.click(); await sleep(3000); o.dialog = (await page.locator('[role=dialog]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 500); o.shotDialog = await shot('../wave2n/r-split-dialog');
  const ok = page.locator('[role=dialog] button', { hasText: /split|confirm|create/i }).last(); if (await ok.count()) { await ok.click(); await sleep(8000); } o.urlAfter = page.url(); o.shotAfter = await shot('../wave2n/r-split-after'); }
return done(o);
