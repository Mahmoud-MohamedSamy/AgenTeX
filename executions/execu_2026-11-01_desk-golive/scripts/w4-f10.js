const KEY = 'fw1.a7a7a7a7000000000000000000000004.kdvoOsta5WvQD0ZFRv0QpASLmUQoAovJq_ARYTAqIE0';
const IF = 'https://staging-crm.taviportal.com/embed/feedback/index.html?key=' + KEY + '&mode=frame';
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
const PN = []; p.on('response', async r => { if (r.request().method() !== 'GET') { let t = ''; try { t = (await r.text()).slice(0, 300); } catch (e) {} PN.push(r.request().method() + ' ' + r.url().replace(KEY, 'KEY') + ' ' + r.status() + ' ' + t); } });
const load = async () => { await p.goto(IF, { waitUntil: 'domcontentloaded', timeout: 60000 }); await p.waitForTimeout(5000); };
await load();
out.page = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 500);
out.inputs = await p.locator('input,textarea,select,button').evaluateAll(es => es.map(e => [e.tagName, e.getAttribute('name'), e.id, e.getAttribute('type'), e.getAttribute('aria-label') || e.getAttribute('placeholder') || (e.innerText || '').trim().slice(0, 20), e.required].join('|')));
await p.screenshot({ path: SHOT + '/w4/W4-35-iframe.png' });
const fields = p.locator('input:not([type=hidden]):not([type=file]):not([type=checkbox]),textarea');
const n = await fields.count(); out.n = n;
const submit = async (vals, label) => { await load(); const fs = p.locator('[name="contact.last_name"],[name=email],[name=subject],[name=description]'); for (let i = 0; i < vals.length; i++) if (vals[i] !== null) await fs.nth(i).fill(vals[i]); const k = PN.length; await p.getByRole('button', { name: /submit|send/i }).first().click(); await p.waitForTimeout(5000); const t = (await p.innerText('body')).replace(/\s+/g, ' '); out[label] = { msgs: (await p.locator('[role=alert],[aria-invalid=true],.error,[class*=error]').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(0, 5), body: t.slice(0, 250), native: await fs.evaluateAll(es => es.map(e => e.validationMessage).filter(Boolean)), net: PN.slice(k) }; await p.screenshot({ path: SHOT + '/w4/W4-' + label + '.png' }); };


await submit(['QA GL W4', 'mmohamed@anyware.software', 'QA GL W4 ' + 'L'.repeat(300), 'long subject'], '36-long');
await submit(['QA GL W4 <b>x</b>', 'mmohamed@anyware.software', 'QA GL W4 form xss <img src=x onerror=alert(1)>', '<script>alert(2)</script> body'], '40-xss');
await submit(['QA GL W4 Tester', 'mmohamed@anyware.software', 'QA GL W4 form 01', 'Submitted from the iframe address, signed out.'], '35-valid');
await ctx.close();
return fin({ out });
