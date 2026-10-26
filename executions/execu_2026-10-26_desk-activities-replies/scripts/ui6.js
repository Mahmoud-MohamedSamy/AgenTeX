// Read-only: composer menus (no typing, no send); comment visibility menu
const out = {}; const T = '4ea11dd5-468a-487c-a967-74b81e8c12cc';
const writes = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && r.method() !== 'GET' && !/heartbeat|presence|\/read$|summaries|resolved-batch|lookups|realtime/.test(u)) writes.push(r.method() + ' ' + u.replace(API, '')); }; page.on('request', f);
const menu = async () => (await page.$$eval('[role=menuitem], [role=menuitemradio], [role=option], [role=menu] button, [role=dialog] button, [role=listbox] *', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => b.innerText.trim().replace(/\s+/g, ' ')).filter(Boolean))])).slice(0, 40);
const clickT = async (name) => { try { await page.getByRole('button', { name, exact: true }).first().click({ timeout: 8000 }); await sleep(1800); return await menu(); } catch (e) { return 'ERR ' + String(e.message).slice(0, 80); } };
await go(`/modules/${M.tickets}/records/${T}`, 14000);
await page.getByRole('button', { name: 'Reply All', exact: true }).click(); await sleep(5000);
out.sendOptions = await clickT('More send options'); await page.keyboard.press('Escape'); await sleep(500);
out.howReply = await clickT('Change how you reply'); await page.keyboard.press('Escape'); await sleep(500);
out.placeholder = await page.$$eval('select', ss => ss.map(s => [...s.options].map(o => o.text).join(' / '))).catch(e => 'ERR');
out.templates = await clickT('Insert template'); out.templatesShot = await shot('tavi-insert-template'); await page.keyboard.press('Escape'); await sleep(800);
out.snippets = await clickT('Snippets'); await page.keyboard.press('Escape'); await sleep(800);
out.ratingLink = await clickT('Rating link'); await page.keyboard.press('Escape'); await sleep(500);
const cancel = page.getByRole('button', { name: 'Cancel', exact: true }); if (await cancel.count()) { await cancel.last().click(); await sleep(1500); const d = page.getByRole('button', { name: /Discard/ }); if (await d.count()) await d.first().click(); }
await sleep(1500);
await page.getByRole('button', { name: /Comment \(Shift \+ C\)/ }).click(); await sleep(3000);
out.commentVisibility = await clickT('Comment visibility'); await page.keyboard.press('Escape'); await sleep(500);
const c2 = page.getByRole('button', { name: 'Cancel', exact: true }); if (await c2.count()) await c2.last().click();
await sleep(1000);
out.drafts = (await api('GET', `/desk/tickets/${T}/drafts`)).t.slice(0, 200);
page.off('request', f); out.writes = writes;
return done(out);
