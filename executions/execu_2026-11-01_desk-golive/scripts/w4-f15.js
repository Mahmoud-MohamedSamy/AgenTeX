const t = await findT('QA GL W4 disabled submit'); out.tk = t.map(d => d.ticket_number + ' ' + d.subject + ' ' + d.created_at);
for (const d of t) CREATED.push({ kind: 'ticket', id: d.id, name: d.ticket_number + ' ' + d.subject });
await go('/settings/channels/web-forms', 10000);
const row = page.locator('li,tr,div').filter({ hasText: /^QA GL W4 form/ }).last();
out.row = (await page.locator('main').innerText()).replace(/\s+/g, ' ').match(/QA GL W4 form.{0,120}/)?.[0];
out.switches = await page.locator('main [role=switch]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || '') + '=' + e.getAttribute('aria-checked')));
const n0 = NET.length;
const sw = page.locator('main [role=switch][aria-label*="QA GL W4 form"]').first();
if (await sw.count()) { await sw.click(); await sleep(3000); out.swNet = NET.slice(n0).filter(x => !/heartbeat|resolved|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.b.slice(0, 200)); }
return fin({ out });
