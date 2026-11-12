const FID = '74fd3081-f5d2-4ad4-aa5d-8f1131254cb1';
const KEY = 'fw1.a7a7a7a7000000000000000000000004.kdvoOsta5WvQD0ZFRv0QpASLmUQoAovJq_ARYTAqIE0';
const IF = 'https://staging-crm.taviportal.com/embed/feedback/index.html?key=' + KEY + '&mode=frame';
out.state = arr(D((await api('GET', '/web-forms')).j)).filter(x => x.id === FID).map(x => 'is_enabled=' + x.is_enabled + ' channel_enabled=' + x.channel_enabled);
const ctx = await page.context().browser().newContext(); const p = await ctx.newPage();
const PN = []; p.on('response', async r => { if (r.request().method() === 'POST' && !/events/.test(r.url())) { let t = ''; try { t = (await r.text()).slice(0, 250); } catch (e) {} PN.push(r.url().replace(KEY, 'KEY').slice(-50) + ' ' + r.status() + ' ' + t); } });
await p.goto(IF, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
out.page = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 300); await p.screenshot({ path: SHOT + '/w4/W4-39-disabled.png' });
if (await p.locator('[name=subject]').count()) { await p.fill('[name="contact.last_name"]', 'QA GL W4'); await p.fill('[name=email]', 'mmohamed@anyware.software'); await p.fill('[name=subject]', 'QA GL W4 disabled submit 2'); await p.getByRole('button', { name: /^Send/ }).click(); await p.waitForTimeout(6000); out.after = (await p.innerText('body')).replace(/\s+/g, ' ').slice(0, 250); }
out.PN = PN; await ctx.close();
const r = await api('POST', '/web-forms/' + FID + '/enable'); out.enable = r.s;
out.state2 = arr(D((await api('GET', '/web-forms')).j)).filter(x => x.id === FID).map(x => 'is_enabled=' + x.is_enabled);
return fin({ out });
