const FID = '74fd3081-f5d2-4ad4-aa5d-8f1131254cb1';
const KEY = 'fw1.a7a7a7a7000000000000000000000004.kdvoOsta5WvQD0ZFRv0QpASLmUQoAovJq_ARYTAqIE0';
const IF = 'https://staging-crm.taviportal.com/embed/feedback/index.html?key=' + KEY + '&mode=frame';
const get = async () => arr(D((await api('GET', '/web-forms')).j)).find(x => x.id === FID);
const upd = async patch => { const f = await get(); let r = await api('PUT', '/web-forms/' + FID, { name: f.name, department_id: f.department_id, layout_id: f.layout_id, is_enabled: f.is_enabled, definition: f.definition, ...patch }, { 'if-match': String(f.row_version) }); if (r.s === 405) r = await api('PATCH', '/web-forms/' + FID, patch, { 'if-match': String(f.row_version) }); return r.s + ' ' + r.t.slice(0, 200); };
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
const PN = []; p.on('response', async r => { if (r.request().method() !== 'GET') { let t = ''; try { t = (await r.text()).slice(0, 250); } catch (e) {} PN.push(r.request().method() + ' ' + r.url().replace(KEY, 'KEY') + ' ' + r.status() + ' ' + t); } });
const fill = async (sub) => { await p.fill('[name="contact.last_name"]', 'QA GL W4'); await p.fill('[name=email]', 'mmohamed@anyware.software'); await p.fill('[name=subject]', sub); };
// CAPTCHA
let f0 = await get();
out.capOn = await upd({ definition: { ...f0.definition, captcha_enabled: true } });
await p.goto(IF, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
out.capPage = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 400); out.capFrames = p.frames().map(f => f.url().slice(0, 80));
await p.screenshot({ path: SHOT + '/w4/W4-38-captcha.png' });
let k = PN.length; await fill('QA GL W4 captcha unsolved'); await p.getByRole('button', { name: /^Send/ }).click(); await p.waitForTimeout(5000);
out.capSubmit = { body: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300), net: PN.slice(k).filter(x => !/events/.test(x)) };
f0 = await get(); out.capOff = await upd({ definition: { ...f0.definition, captcha_enabled: false } });
// Arabic
f0 = await get(); out.arOn = await upd({ definition: { ...f0.definition, language: 'ar' } });
await p.goto(IF, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
out.arPage = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); out.arDir = await p.evaluate(() => document.documentElement.dir + '/' + document.documentElement.lang + '/' + getComputedStyle(document.body).direction);
await p.screenshot({ path: SHOT + '/w4/W4-41-arabic.png' });
k = PN.length; await p.fill('[name="contact.last_name"]', 'اختبار'); await p.fill('[name=email]', 'mmohamed@anyware.software'); await p.fill('[name=subject]', 'QA GL W4 نموذج عربي ٠١'); await p.fill('[name=description]', 'وصف باللغة العربية'); await p.getByRole('button').filter({ hasNotText: /Reset|إعادة/ }).first().click(); await p.waitForTimeout(5000);
out.arSubmit = { body: (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 200), net: PN.slice(k).filter(x => !/events/.test(x)) };
f0 = await get(); out.arOff = await upd({ definition: { ...f0.definition, language: 'en' } });
// Script embed on another site (null origin)
const snip = '<!doctype html><html><body><h3>QA GL W4 embed page</h3><div data-anyware-form="' + KEY + '"></div><script async src="https://staging-crm.taviportal.com/embed/feedback/loader/feedback.js"></script></body></html>';
const cons = []; p.on('console', m => { if (m.type() === 'error') cons.push(m.text().slice(0, 200)); }); p.on('response', r => { if (r.status() >= 400) cons.push(r.status() + ' ' + r.url().replace(KEY, 'KEY').slice(0, 160)); });
await p.route('https://qa-gl-w4.example.test/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: snip }));
k = PN.length; await p.goto('https://qa-gl-w4.example.test/page.html'); await p.waitForTimeout(9000);
out.embedPage = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); out.embedFrames = p.frames().map(f => f.url().slice(0, 90)); out.embedCons = cons.slice(0, 5);
await p.screenshot({ path: SHOT + '/w4/W4-37-embed.png' });
await ctx.close();
return fin({ out });
