// Owner UI pass 2: list, views, modes, queues, tags page, numbering, bell, search (W2-01..08, 64, 71, 73, 83)
const o = {};
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const snip = (t, k, n) => { const i = t.indexOf(k); return i < 0 ? '(not found: ' + k + ')' : t.slice(i, i + (n || 500)).replace(/\s+/g, ' '); };
const raw = t => (t.match(/\b[a-z]+[A-Za-z]*(\.[a-zA-Z_]+){2,}\b/g) || []).filter(x => !/\.(com|software|png|json|js)$/.test(x)).slice(0, 6);
const main = async () => (await page.$eval('main', m => m.innerText).catch(() => '')).replace(/\s+/g, ' ');
// API timing
let ts = Date.now(); const la = await api('GET', `/modules/${T}/records?limit=25&sort=-created_at`); o.listApiMs = Date.now() - ts; o.listApi = la.s;
// custom view via API
const vc = await api('POST', `/modules/${T}/views`, { name: 'QA GL W2 view', type: 'list', view_type: 'table', criteria: { op: 'eq', field: 'department', value: DQ }, columns: ['subject', 'status', 'priority'], settings: { categorize_field: 'status' } }); o.viewCreate = sh(vc); const vid = vc.j && vc.j.data && vc.j.data.id;
if (vid) { CREATED.push({ k: 'view', id: vid }); o.pin = (await api('PUT', `/modules/${T}/views/${vid}/pin`, {})).s; const vl = await api('GET', `/modules/${T}/views`); o.viewListed = JSON.stringify(vl.j && vl.j.data).includes('QA GL W2 view'); o.viewPinned = JSON.stringify(vl.j && vl.j.data).slice(0, 400);
  o.unpin = (await api('DELETE', `/modules/${T}/views/${vid}/pin`)).s; const cl = await api('POST', `/modules/${T}/views/${vid}/clone`, { name: 'QA GL W2 view clone' }); o.clone = sh(cl); const cid = cl.j && cl.j.data && cl.j.data.id; if (cid) { CREATED.push({ k: 'view', id: cid }); o.cloneDel = (await api('DELETE', `/modules/${T}/views/${cid}`)).s; }
  o.viewDup = sh(await api('POST', `/modules/${T}/views`, { name: 'QA GL W2 view', type: 'list', view_type: 'table', columns: ['subject'], settings: { categorize_field: 'status' } })); }
// list page
ts = Date.now(); await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); let t = await waitText(/All Tickets \(\d/, 90); o.listPageMs = Date.now() - ts;
o.views = snip(t, 'STARRED VIEWS', 600); o.listRaw = raw(t); o.shotList = await shot('../wave2n/ui-list');
o.qaInList = (t.match(/QA GL W2/g) || []).length;
const cv = page.locator('button', { hasText: /Classic View|Table View|Compact View/ }).first(); if (await cv.count()) { await cv.click().catch(() => {}); await sleep(1500); o.modes = await page.$$eval('[role=menuitem], [role=option], [role=menuitemradio]', m => m.map(x => x.innerText.trim()).filter(Boolean));
  const tv = page.locator('[role=menuitem], [role=option], [role=menuitemradio]', { hasText: /^Table View$/ }).first(); if (await tv.count()) { await tv.click().catch(() => {}); await sleep(4000); o.tableView = (await main()).slice(0, 300); o.shotTable = await shot('../wave2n/ui-table-view'); } else await page.keyboard.press('Escape'); }
if (vid) { await page.goto(H + '/views/' + vid + '/tickets', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); const tv = await waitText(/QA GL W2 view/, 40); o.customViewPage = snip(tv, 'QA GL W2 view', 400); o.customOnlyMarketing = !/Customer Support ·|Tech ·|Sales ·/.test(await main()); o.shotCustomView = await shot('../wave2n/ui-custom-view'); }
for (const [k, u, re] of [['agentQ', '/views/agent-queue', /Mode|queue|Queue/], ['teamQ', '/views/team-queue', /Mode|queue|Queue/], ['tags', '/views/tags', /Tags/]]) { ts = Date.now(); await page.goto(H + u, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(re, 40); await sleep(4000); const m = await main(); o[k] = { url: page.url().replace(H, ''), ms: Date.now() - ts, text: m.slice(0, 450), raw: raw(m) }; o['shot_' + k] = await shot('../wave2n/ui-' + k); }
await page.goto(H + '/settings/tickets/numbering', { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); await waitText(/Ticket Number/, 40); await sleep(3000); o.numbering = (await main()).slice(0, 600); o.shotNum = await shot('../wave2n/ui-numbering');
// bell
const bell = page.locator('button[aria-label="Notifications"]').first(); if (await bell.count()) { await bell.click().catch(() => {}); await sleep(6000); const bt = await txt(); o.bell = snip(bt, 'Notifications', 600); o.bellRaw = raw(bt); o.shotBell = await shot('../wave2n/ui-bell'); await page.keyboard.press('Escape'); }
// global search UI
const sb = page.locator('button', { hasText: /Search or jump to/ }).first(); if (await sb.count()) { await sb.click().catch(() => {}); await sleep(1500); await page.keyboard.type('QA GL W2 base', { delay: 40 }); await sleep(6000); o.searchUi = snip(await txt(), 'QA GL W2 base', 300); o.shotSearch = await shot('../wave2n/ui-search'); await page.keyboard.press('Escape'); }
return fin(o);
