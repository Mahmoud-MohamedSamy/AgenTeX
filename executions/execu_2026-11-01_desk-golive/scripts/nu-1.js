// Owner UI pass 1: ticket detail page (W2-15, 17, 29, 60, 67, 72, 80, 14, 66)
const tk = IDS.base; const o = {}; const dialogs = [];
page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const snip = (t, k, n) => { const i = t.indexOf(k); return i < 0 ? '(not found: ' + k + ')' : t.slice(i, i + (n || 700)).replace(/\s+/g, ' '); };
const raw = t => (t.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).filter(x => !/\.(com|software|png|json|js)$/.test(x)).slice(0, 6);
const t0 = Date.now(); await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
let t = await waitText(/QA GL W2 base ticket edited/, 90); o.loadMs = Date.now() - t0; await sleep(2500); t = await txt();
o.tabs = ['CONVERSATION', 'RESOLUTION', 'TIME ENTRY', 'ATTACHMENT', 'PARENT-CHILD', 'ACTIVITY', 'APPROVAL', 'HISTORY'].filter(x => t.toUpperCase().includes(x));
o.header = snip(t, 'QA GL W2 base ticket edited', 300); o.raw = raw(t);
o.sla = snip(t, 'SLA', 200);
o.shotDetail = await shot('../wave2n/ui-detail');
const more = page.locator('button[aria-label="More ticket actions"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1500); o.moreMenu = (await page.$$eval('[role=menuitem]', m => m.map(x => x.innerText.trim()).filter(Boolean))).slice(0, 30); await page.keyboard.press('Escape'); }
// XSS: comment with <script> and <img onerror>, rendered on this page
await page.mouse.wheel(0, 1500); await sleep(1500); t = await txt();
o.commentBoldShown = /QA GL W2 bold/.test(t); o.scriptTextShown = /<script>alert\(1\)<\/script>/.test(t);
o.scriptInDom = await page.evaluate(() => [...document.querySelectorAll('script')].some(s => /alert\(1\)/.test(s.textContent)));
o.imgOnerror = await page.evaluate(() => [...document.querySelectorAll('img')].some(i => i.getAttribute('onerror')));
o.mentionRender = snip(t, 'QA GL W2 mention', 120);
// History tab
const hist = page.locator('[role=tab]', { hasText: /HISTORY/i }).first(); if (await hist.count()) { await hist.click().catch(() => {}); await sleep(5000); const th = await txt(); o.hist = snip(th, 'Ticket History', 1500); o.histUuid = (th.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g) || []).slice(0, 3); o.histRaw = raw(th); o.shotHist = await shot('../wave2n/ui-history'); }
// Approval tab
const apt = page.locator('[role=tab]', { hasText: /APPROVAL/i }).first(); if (await apt.count()) { await apt.click().catch(() => {}); await sleep(4000); o.approvalTab = snip(await txt(), 'QA GL W2 approval', 600); o.shotAp = await shot('../wave2n/ui-approvals'); }
// AI assist
const ai = page.locator('button[aria-label="AI assist"]').first(); o.aiTab = await ai.count();
if (o.aiTab) { await ai.click({ force: true }).catch(() => {}); await sleep(5000); o.aiPane = snip(await txt(), 'AI assist', 400);
  const run = page.locator('button', { hasText: /Summarize ticket/i }).first(); if (await run.count()) { const reqs = []; const on = r => { if (/\/ai\//.test(r.url())) reqs.push(r.url().replace(H, '')); }; page.on('request', on); await run.click().catch(() => {}); await sleep(12000); page.off('request', on); o.aiReqs = reqs.slice(0, 3); o.aiAfter = snip(await txt(), 'AI assist', 500); o.shotAi = await shot('../wave2n/ui-ai'); } }
// Print
if (await more.count()) { await more.click().catch(() => {}); await sleep(1200); const pr = page.getByRole('menuitem', { name: 'Print' }).first(); if (await pr.count()) { await pr.click().catch(() => {}); await sleep(5000); o.print = snip(await txt(), 'Print ticket', 400); o.shotPrint = await shot('../wave2n/ui-print'); await page.keyboard.press('Escape'); } }
// Reply all composer -> Articles + signature + tools
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/QA GL W2 base ticket edited/, 40); await sleep(2000);
const ra = page.locator('button', { hasText: /^Reply All$|^Reply$/ }).first(); if (await ra.count()) { await ra.click().catch(() => {}); await sleep(4000); const art = page.locator('button', { hasText: /^Articles$/ }).first(); o.articlesBtn = await art.count();
  if (o.articlesBtn) { await art.click().catch(() => {}); await sleep(7000); o.articles = snip(await txt(), 'Suggested articles', 300); o.shotArt = await shot('../wave2n/ui-kb'); }
  o.composerTools = await page.$$eval('button[aria-label], button[title]', bs => bs.filter(b => b.offsetParent !== null && b.closest('[contenteditable], form, [role=dialog], section')).map(b => b.getAttribute('aria-label') || b.getAttribute('title')).filter(Boolean).slice(0, 50));
  await page.keyboard.press('Escape'); const disc = page.locator('button', { hasText: /^Discard$/ }).first(); if (await disc.count()) await disc.click().catch(() => {}); await sleep(1500); const yes = page.locator('[role=dialog] button', { hasText: /Discard/ }).first(); if (await yes.count()) await yes.click().catch(() => {}); }
// Shift+C
await page.locator('main').first().click({ position: { x: 400, y: 20 } }).catch(() => {}); await page.keyboard.press('Escape'); await page.keyboard.press('Shift+C'); await sleep(2500); o.editorsAfterShiftC = await page.$$eval('[contenteditable=true]', e => e.filter(x => x.offsetParent !== null).length); await page.keyboard.press('Escape');
// XSS subject ticket
await page.goto(H + '/views/all/tickets/' + IDS.xss, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); const tx = await waitText(/QA GL W2/, 35); o.xssSubjectAsText = /<img src=x onerror=alert\(1\)>/.test(tx);
o.dialogs = dialogs.slice();
return done(o);
