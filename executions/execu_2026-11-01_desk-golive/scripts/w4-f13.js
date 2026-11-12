const FID = '74fd3081-f5d2-4ad4-aa5d-8f1131254cb1';
const KEY = 'fw1.a7a7a7a7000000000000000000000004.kdvoOsta5WvQD0ZFRv0QpASLmUQoAovJq_ARYTAqIE0';
const IF = 'https://staging-crm.taviportal.com/embed/feedback/index.html?key=' + KEY + '&mode=frame';
const get = async () => arr(D((await api('GET', '/web-forms')).j)).find(x => x.id === FID);
const upd = async patch => { const f = await get(); const r = await api('PUT', '/web-forms/' + FID, { name: f.name, department_id: f.department_id, layout_id: f.layout_id, is_enabled: f.is_enabled, definition: f.definition, ...patch }, { 'if-match': String(f.row_version) }); return r.s + ' ' + r.t.slice(0, 160); };
let f0 = await get(); out.orig = await upd({ definition: { ...f0.definition, allowed_origins: ['https://qa-gl-w4.example.test'] } });
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
const PN = []; p.on('response', async r => { const m = r.request().method(); if (m !== 'GET' || r.status() >= 400) { let t = ''; try { t = (await r.text()).slice(0, 200); } catch (e) {} PN.push(m + ' ' + r.url().replace(KEY, 'KEY').slice(0, 140) + ' ' + r.status() + ' ' + t); } });
const snip = '<!doctype html><html><body><h3>QA GL W4 embed page</h3><div data-anyware-form="' + KEY + '"></div><script async src="https://staging-crm.taviportal.com/embed/feedback/loader/feedback.js"></script></body></html>';
await p.route('https://qa-gl-w4.example.test/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: snip }));
await p.goto('https://qa-gl-w4.example.test/page.html'); await p.waitForTimeout(10000);
out.embedText = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); out.frames = p.frames().map(f => f.url().slice(0, 90));
let fr = p.frames().find(f => /embed\/feedback/.test(f.url())) || p.mainFrame();
const has = await fr.locator('[name=subject]').count(); out.hasForm = has;
if (has) { const k = PN.length; await fr.fill('[name="contact.last_name"]', 'QA GL W4'); await fr.fill('[name=email]', 'mmohamed@anyware.software'); await fr.fill('[name=subject]', 'QA GL W4 form embed 01'); await fr.getByRole('button', { name: /^Send/ }).click(); await p.waitForTimeout(6000); out.embedSubmit = PN.slice(k).filter(x => !/events/.test(x)); out.after = (await fr.innerText('body')).replace(/\s+/g, ' ').slice(0, 200); }
await p.screenshot({ path: SHOT + '/w4/W4-37-embed2.png' });
out.PN = PN.filter(x => !/events/.test(x)).slice(0, 10);
f0 = await get(); out.origBack = await upd({ definition: { ...f0.definition, allowed_origins: [] } });
// W4-39 disable
out.dis = await upd({ is_enabled: false });
await p.goto(IF, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
out.disPage = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); await p.screenshot({ path: SHOT + '/w4/W4-39-disabled.png' });
const sr = await p.request.post('https://staging-crm.taviportal.com/api/v1/web-forms/public/' + KEY + '/submissions', { data: { fields: { 'contact.last_name': 'QA GL W4', email: 'mmohamed@anyware.software', subject: 'QA GL W4 disabled submit' } }, failOnStatusCode: false });
out.disPost = sr.status() + ' ' + (await sr.text()).slice(0, 250);
out.en = await upd({ is_enabled: true });
await ctx.close();
return fin({ out });
