// Read-only: open reply composer / more-ways menu / comment composer / ticket Activity tab without typing or sending
const out = {}; const T = '4ea11dd5-468a-487c-a967-74b81e8c12cc';
const writes = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && !['GET'].includes(r.method()) && !/heartbeat|presence|\/read$|summaries|resolved-batch|lookups|realtime/.test(u)) writes.push(r.method() + ' ' + u.replace(API, '')); }; page.on('request', f);
await go(`/modules/${M.tickets}/records/${T}`, 14000);
const vis = async () => (await page.$$eval('[role=dialog], form, [contenteditable=true]', es => es.map(e => (e.innerText || '').replace(/\s+/g, ' ').slice(0, 900)))).filter(Boolean);
const ctrls = async (sel) => page.$$eval(sel || 'button, [role=menuitem], [role=combobox], input, select, [role=option]', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => (b.getAttribute('aria-label') || b.getAttribute('placeholder') || b.innerText || b.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 45)).filter(Boolean))]);
await page.getByRole('button', { name: 'More ways to reply' }).click(); await sleep(1500);
out.moreWays = await page.$$eval('[role=menuitem], [role=menu] button', bs => bs.map(b => b.innerText.trim().replace(/\s+/g, ' ')));
await page.keyboard.press('Escape'); await sleep(500);
await page.getByRole('button', { name: 'Reply All', exact: true }).click(); await sleep(5000);
out.composerText = (await txt()).split('Reply All').slice(1).join(' | ').slice(0, 3000);
out.composerCtrls = await ctrls(); out.composerShot = await shot('tavi-reply-composer');
// discard without typing
for (const n of ['Discard', 'Cancel', 'Close']) { const b = page.getByRole('button', { name: n, exact: true }); if (await b.count()) { await b.first().click().catch(() => {}); await sleep(1500); const c = page.getByRole('button', { name: /Discard|Yes/ }); if (await c.count()) await c.first().click().catch(() => {}); break; } }
await sleep(1500);
await page.getByRole('button', { name: /Comment \(Shift \+ C\)/ }).click(); await sleep(3000);
out.commentCtrls = await ctrls(); out.commentShot = await shot('tavi-comment-composer');
for (const n of ['Cancel', 'Discard', 'Close']) { const b = page.getByRole('button', { name: n, exact: true }); if (await b.count()) { await b.first().click().catch(() => {}); break; } }
await sleep(1500);
await page.getByRole('button', { name: 'More ticket actions' }).click(); await sleep(1500);
out.ticketActions = await page.$$eval('[role=menuitem]', bs => bs.map(b => b.innerText.trim().replace(/\s+/g, ' ')));
await page.keyboard.press('Escape'); await sleep(500);
await page.getByRole('button', { name: 'Conversation entry actions' }).first().click(); await sleep(1200);
out.entryActions = await page.$$eval('[role=menuitem]', bs => bs.map(b => b.innerText.trim().replace(/\s+/g, ' ')));
await page.keyboard.press('Escape'); await sleep(500);
try { const tabs = page.locator('main [role=tab], main button').filter({ hasText: /^\s*ACTIVITY\s*$/i }); out.actTabCount = await tabs.count(); await tabs.first().click({ timeout: 8000 }); } catch (e) { out.actTabErr = String(e.message).slice(0, 120); } await sleep(5000);
out.activityTab = (await txt()).split('HISTORY').slice(1).join(' ').slice(0, 1500); out.activityShot = await shot('tavi-ticket-activity-tab');
out.activityCtrls = await ctrls('main button, main [role=combobox]');
page.off('request', f); out.writes = writes;
return done(out);
