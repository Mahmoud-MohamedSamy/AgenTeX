// Read-only: Send drop-down options; ticket detail API keys; workflow modules offered
const out = {}; const T = '4ea11dd5-468a-487c-a967-74b81e8c12cc';
const td = await api('GET', `/desk/tickets/${T}`); out.ticketKeys = td.j && td.j.data ? Object.keys(td.j.data).join(',') : td.t.slice(0, 300);
out.ticketCounts = td.j && td.j.data ? Object.fromEntries(Object.entries(td.j.data).filter(([k]) => /count|thread|repl|activ|task|first_resp|respon/i.test(k))) : null;
await go(`/modules/${M.tickets}/records/${T}`, 14000);
await page.getByRole('button', { name: 'Reply All', exact: true }).click(); await sleep(5000);
const send = page.getByRole('button', { name: 'Send', exact: true }).last(); const bb = await send.boundingBox();
const near = await page.$$eval('button', (bs, y) => bs.filter(b => { const r = b.getBoundingClientRect(); return Math.abs(r.y - y) < 25; }).map(b => ({ l: b.getAttribute('aria-label'), t: b.innerText.trim(), h: b.getAttribute('aria-haspopup') })), bb ? bb.y : 0);
out.sendRow = near;
const trig = page.locator('button[aria-haspopup]').filter({ hasNotText: /Reply|Snippets|template/i });
for (const n of near.filter(x => x.h)) { try { await page.getByRole('button', { name: n.l || n.t, exact: true }).last().click({ timeout: 5000 }); await sleep(1500); out['menu_' + (n.l || n.t)] = await page.$$eval('[role=menuitem], [role=menuitemradio], [role=menu] *', bs => [...new Set(bs.filter(b => b.offsetParent !== null && b.children.length < 2).map(b => b.innerText.trim()).filter(Boolean))]); out['shot_' + (n.l || n.t)] = await shot('tavi-send-options'); await page.keyboard.press('Escape'); await sleep(500); } catch (e) { out['err_' + (n.l || n.t)] = String(e.message).slice(0, 80); } }
const c = page.getByRole('button', { name: 'Cancel', exact: true }); if (await c.count()) await c.last().click();
await sleep(1000);
return done(out);
