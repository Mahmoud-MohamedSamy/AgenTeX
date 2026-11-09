// NDC-2655 screen: Settings › Company › Business Hours — Save unchanged twice; record the settings PUT status + error code (body shape only, no secrets).
const calls = [];
page.on('response', async r => { if (/\/settings\/values/.test(r.url()) && r.request().method() !== 'GET') { let b = ''; try { b = (await r.text()).slice(0, 220); } catch (e) { } calls.push(r.request().method() + ' ' + r.status() + ' ' + b); } });
let sent = null; page.on('request', q => { if (/\/settings\/values/.test(q.url()) && q.method() !== 'GET') sent = (q.postData() || '').slice(0, 700); });
await page.goto(H + '/settings/company/business-hours', { waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=Business Hours', { timeout: 120000 }); await sleep(5000);
await shot('2655-1-page.png'); const t0 = await text();
const saveBtn = async () => page.$('button:has-text("Save")');
let b = await saveBtn(); const out = { saveEnabled: b ? !(await b.isDisabled()) : 'no button', page: (t0.match(/Business Hours.{0,400}/s) || [''])[0].replace(/\s+/g, ' ') };
if (b && !(await b.isDisabled())) { await b.click(); await sleep(6000); }
await shot('2655-2-after-save1.png'); out.toast1 = ((await text()).match(/.{0,30}(saved|updated|error|invalid|failed).{0,120}/i) || [''])[0].replace(/\s+/g, ' ');
await page.reload({ waitUntil: 'domcontentloaded', timeout: 150000 }); await page.waitForSelector('text=Business Hours', { timeout: 120000 }); await sleep(5000);
b = await saveBtn(); out.save2Enabled = b ? !(await b.isDisabled()) : 'no button';
if (b && !(await b.isDisabled())) { await b.click(); await sleep(6000); }
await shot('2655-3-after-save2.png'); out.toast2 = ((await text()).match(/.{0,30}(saved|updated|error|invalid|failed).{0,120}/i) || [''])[0].replace(/\s+/g, ' ');
out.calls = calls; out.sentBody = sent;
return out;
