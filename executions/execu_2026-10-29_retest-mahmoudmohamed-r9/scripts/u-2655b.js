// NDC-2655 screen: Business Hours → Workweek (Sun–Thu) Save → Always open 24/7 Save → reload. Captures every API write the page sends
// (path, body, status) so the stored record can be read and re-saved unchanged by API afterwards. Ends on Always open 24/7 (the default shown before).
const calls = [];
const skip = u => /auth|telemetry|presence|heartbeat|notifications/.test(u);
page.on('request', q => { const u = q.url(); if (u.includes('/api/') && q.method() !== 'GET' && !skip(u)) calls.push({ dir: '→', m: q.method(), p: u.replace(/^.*\/api\/v1/, ''), body: (q.postData() || '').slice(0, 600) }); });
page.on('response', async r => { const u = r.url(); if (u.includes('/api/') && r.request().method() !== 'GET' && !skip(u)) { let t = ''; try { t = (await r.text()).slice(0, 250); } catch (e) { } calls.push({ dir: '←', p: u.replace(/^.*\/api\/v1/, ''), s: r.status(), body: t }); } });
const open = async () => { await page.goto(H + '/settings/company/business-hours', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=Operating schedule', { timeout: 120000 }); await sleep(3000); };
const save = async name => { const b = await page.$('button:has-text("Save changes")'); const en = b ? !(await b.isDisabled()) : false; if (en) { await b.click(); await sleep(6000); } await shot(name); return en; };
const msg = async () => ((await text()).match(/.{0,20}(saved|updated|error|invalid|failed|requires).{0,120}/i) || [''])[0].replace(/\s+/g, ' ');
const out = {};
await open(); await page.click('text=Workweek'); await sleep(2000);
await page.click('button:has-text("FRI")'); await sleep(500); await page.click('button:has-text("SAT")'); await sleep(1000);
await shot('2655-4-workweek.png'); out.saveWorkweek = await save('2655-5-workweek-saved.png'); out.msg1 = await msg();
await open(); out.afterReload1 = (await text()).match(/Pick your five working days.{0,80}|No window to configure.{0,40}/s)?.[0]?.replace(/\s+/g, ' ');
await page.click('text=Always open'); await sleep(2000); out.save247 = await save('2655-6-247-saved.png'); out.msg2 = await msg();
await open(); out.afterReload2 = (await text()).match(/Pick your five working days.{0,80}|No window to configure.{0,40}/s)?.[0]?.replace(/\s+/g, ' ');
out.calls = calls; return out;
