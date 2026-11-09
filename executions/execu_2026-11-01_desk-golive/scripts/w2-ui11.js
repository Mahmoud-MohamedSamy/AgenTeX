const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const main = async () => (await page.$eval('main', m => m.innerText).catch(() => '')).replace(/\s+/g, ' ');
await page.goto(H + '/views', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/ALL VIEWS|All Tickets/, 35); await sleep(2000); o.viewsPage = (await main()).slice(0, 700); o.shotViews = await shot('wave2/ui-views');
for (const [k, u] of [['agentQ', '/views/agent-queue'], ['teamQ', '/views/team-queue'], ['tags', '/views/tags']]) { await page.goto(H + u, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(9000); o[k] = (await main()).slice(0, 500); }
await page.goto(H + '/settings/tickets/numbering', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await sleep(12000); o.numbering = (await main()).slice(0, 500);
// Arabic
await page.evaluate(() => { try { localStorage.setItem('anyware_language', 'ar'); } catch (e) {} });
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base/, 35); await sleep(3000);
o.dir = await page.evaluate(() => document.documentElement.dir || document.body.dir); const ta = await txt(); o.arSample = ta.replace(/\s+/g, ' ').slice(0, 400); o.arLatinWords = (ta.match(/\b(Reply|Comment|Close ticket|Conversation|History|Resolution|Pick up|Ticket Properties|Status|Priority)\b/g) || []).slice(0, 10);
o.arRaw = (ta.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).slice(0, 6); o.shotAr = await shot('wave2/ui-ticket-ar');
await page.evaluate(() => { try { localStorage.setItem('anyware_language', 'en'); } catch (e) {} });
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base/, 35); await sleep(2000);
// focus order
const seq = []; await page.locator('body').click({ position: { x: 700, y: 120 } }).catch(() => {}); for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); await sleep(150); seq.push(await page.evaluate(() => { const a = document.activeElement; if (!a) return null; const s = getComputedStyle(a); return (a.getAttribute('aria-label') || a.innerText || a.tagName).trim().slice(0, 25) + '|' + (s.outlineStyle !== 'none' || s.boxShadow !== 'none' ? 'ring' : 'noring'); })); }
o.focus = seq;
return done(o);
