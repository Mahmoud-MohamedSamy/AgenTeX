const tk = '3008a52d-6f69-48bb-90ba-bac134c7aa56', XS = '07e8ad7e-1ded-43f3-8a2f-54bb0bbfca8d'; const o = {}; const dialogs = [];
page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });
const waitText = async (re, n) => { for (let i = 0; i < (n || 25); i++) { await sleep(1000); const t = await txt().catch(() => ''); if (re.test(t)) return t; } return await txt().catch(() => ''); };
const vis = async () => page.$$eval('button, [role=menuitem], [role=tab], a', bs => [...new Set(bs.filter(b => b.offsetParent !== null).map(b => (b.getAttribute('aria-label') || b.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40)).filter(Boolean))]);
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
let t = await waitText(/QA GL W2 base ticket/, 30); o.loaded = /QA GL W2 base ticket/.test(t);
o.tabs = ['Conversation', 'Resolution', 'Time Entry', 'Attachment', 'Parent-Child', 'Activity', 'Approval', 'History'].filter(x => t.includes(x));
o.rawKeys = (t.match(/\b[a-z]+(\.[a-zA-Z_]+){2,}\b/g) || []).slice(0, 8);
o.buttons = (await vis()).slice(0, 80);
o.aiVisible = /AI assist|Summary|Suggest/i.test(t);
// More menu
const more = page.locator('button[aria-label="More ticket actions"]').first(); if (await more.count()) { await more.click().catch(() => {}); await sleep(1500); o.moreMenu = (await page.$$eval('[role=menuitem]', m => m.map(x => x.innerText.trim()).filter(Boolean))).slice(0, 30); await page.keyboard.press('Escape'); }
// History tab text
const hist = page.locator('[role=tab]:has-text("History")').first(); if (await hist.count()) { await hist.click().catch(() => {}); await sleep(4000); const th = await txt(); const i = th.indexOf('History'); o.history = th.slice(i, i + 1500).replace(/\s+/g, ' '); o.histRawUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(th.slice(i, i + 4000)); o.histRawDeptKey = /department_id/.test(th); }
o.shotDetail = await shot('../wave2/ui-ticket-detail');
// Shift+C shortcut
await page.locator('body').click({ position: { x: 5, y: 300 } }).catch(() => {}); await page.keyboard.press('Shift+C'); await sleep(2000); o.afterShiftC = (await page.$$eval('[contenteditable=true], textarea', e => e.filter(x => x.offsetParent !== null).length));
await page.keyboard.press('Escape');
// XSS ticket render
await page.goto(H + '/views/all/tickets/' + XS, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); const tx = await waitText(/QA GL W2/, 30); o.xssSubjectShown = /<img src=x onerror=alert\(1\)>/.test(tx); o.dialogs = dialogs.slice();
// base ticket comment with script
await page.goto(H + '/views/all/tickets/' + tk, { waitUntil: 'commit', timeout: 60000 }).catch(() => {}); const tb = await waitText(/QA GL W2 bold|QA GL W2 base/, 30); o.commentBoldShown = /QA GL W2 bold/.test(tb); o.dialogs2 = dialogs.slice(); o.scriptInDom = await page.evaluate(() => [...document.querySelectorAll('script')].some(s => /alert\(1\)/.test(s.textContent)));
o.imgOnerror = await page.evaluate(() => [...document.querySelectorAll('img')].some(i => i.getAttribute('onerror')));
return done(o);
