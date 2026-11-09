const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56'; const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const snip = (t, k, n) => { const i = t.indexOf(k); return i < 0 ? '(not found: ' + k + ')' : t.slice(i, i + (n || 500)).replace(/\s+/g, ' '); };
const raw = t => (t.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).filter(x => !/\.(com|software|png|json|js)$/.test(x)).slice(0, 6);
const t0 = Date.now(); await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); let t = await waitText(/All Tickets|ALL VIEWS/, 40); o.listMs = Date.now() - t0;
o.views = snip(t, 'STARRED VIEWS', 600); o.listRaw = raw(t);
o.modeButtons = await page.$$eval('button[aria-label], [role=radio]', bs => bs.filter(b => b.offsetParent !== null).map(b => b.getAttribute('aria-label') || b.innerText.trim()).filter(x => /view|board|table|classic|compact|kanban|list/i.test(x)).slice(0, 12));
for (const [k, u, re] of [['agentQ', '/views/agent-queue', /Agent Queue|Unassigned|Agents/], ['teamQ', '/views/team-queue', /Team Queue|Teams/], ['tags', '/views/tags', /Tags/]]) { const ts = Date.now(); await page.goto(H + u, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); const x = await waitText(re, 30); o[k] = { url: page.url().replace(H, ''), ms: Date.now() - ts, text: x.replace(/\s+/g, ' ').slice(x.indexOf('Scheduled Replies') + 17, x.indexOf('Scheduled Replies') + 400), raw: raw(x) }; }
await page.goto(H + '/settings/tickets/numbering', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); t = await waitText(/Ticket Number/, 30); o.numbering = snip(t, 'Default format', 500);
// bell
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base/, 35);
const bell = page.locator('button[aria-label="Notifications"]').first(); if (await bell.count()) { await bell.click().catch(() => {}); await sleep(4000); o.bell = snip(await txt(), 'Notifications', 600); o.bellRaw = raw(await txt()); await page.keyboard.press('Escape'); }
// KB articles in composer
const ra = page.locator('button', { hasText: /^Reply All$/ }).first(); if (await ra.count()) { await ra.click().catch(() => {}); await sleep(4000); const art = page.locator('button', { hasText: /^Articles$/ }).first(); o.articlesBtn = await art.count();
  if (o.articlesBtn) { await art.click().catch(() => {}); await sleep(7000); const tt = await txt(); o.articles = snip(tt, 'Suggested articles', 400); o.shotArt = await shot('wave2/ui-kb-suggest'); }
  o.composerTools = await page.$$eval('button[aria-label], button[title]', bs => bs.filter(b => b.offsetParent !== null).map(b => b.getAttribute('aria-label') || b.getAttribute('title')).filter(Boolean).slice(0, 60)); }
return done(o);
