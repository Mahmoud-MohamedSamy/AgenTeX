const out = {};
const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.t.slice(0, 200));
const ID = '9dfb198b-8f5c-4c38-9dcc-2a4d0ebdc34d';
await go('/settings/organization/email-templates', 10000);
const row = page.locator('tr').filter({ hasText: 'QA GL W4 template' }).first();
out.rowBtns = await row.locator('button').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || '').trim()));
let n0 = NET.length;
const star = row.locator('button[aria-label*=tar i]').first(); if (await star.count()) { await star.click(); await sleep(2500); }
out.starNet = nn(n0);
const more = row.locator('button').last(); await more.click(); await sleep(1200);
out.menu = await page.locator('[role=menuitem]').allInnerTexts();
n0 = NET.length;
const cl = page.getByRole('menuitem', { name: /clone|duplicate|copy/i }).first(); if (await cl.count()) { await cl.click(); await sleep(3500); const d = page.locator('[role=dialog]').last(); if (await d.count()) { out.cloneDlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.getByRole('button', { name: /clone|save|create|duplicate/i }).last().click().catch(() => {}); await sleep(3000); } }
out.cloneNet = nn(n0); out.cloneUrl = page.url();
// edit via API (PATCH/PUT)
const cur = D((await api('GET', '/desk/email-templates/' + ID)).j);
out.get = cur ? Object.keys(cur).join(',') : null;
let r = await api('PATCH', '/desk/email-templates/' + ID, { subject: 'QA GL W4 edited [#{{ticket.number}}] {{ticket.subject}}', row_version: cur && cur.row_version });
out.patch = r.s + ' ' + r.t.slice(0, 200);
if (r.s >= 400) { r = await api('PUT', '/desk/email-templates/' + ID, { ...cur, subject: 'QA GL W4 edited [#{{ticket.number}}] {{ticket.subject}}' }); out.put = r.s + ' ' + r.t.slice(0, 200); }
// Arabic template + script body via API
r = await api('POST', '/desk/email-templates', { name: 'QA GL W4 قالب عربي', module: 'desk_tickets', notification_type: 'contact', department_id: '2a73bbc0-efb3-4250-bf9b-2fdc98236794', subject: 'QA GL W4 تذكرة رقم {{ticket.number}}', body_html: '<p dir="rtl">مرحبا {{customer.name}}، هذه رسالة اختبار بخصوص التذكرة {{ticket.number}}.</p>' });
out.ar = r.s + ' ' + r.t.slice(0, 300); if (r.j && r.j.data) CREATED.push({ kind: 'email-template', id: r.j.data.id, name: r.j.data.name });
r = await api('POST', '/desk/email-templates', { name: 'QA GL W4 script', module: 'desk_tickets', notification_type: 'contact', subject: 'QA GL W4 script', body_html: '<p>hi</p><script>alert(1)</script><img src=x onerror="alert(2)"><a href="javascript:alert(3)">x</a>' });
out.xss = r.s + ' ' + r.t.slice(0, 600); if (r.j && r.j.data) CREATED.push({ kind: 'email-template', id: r.j.data.id, name: r.j.data.name });
// filters W4-23
const f = {};
for (const q of ['department_id=2a73bbc0-efb3-4250-bf9b-2fdc98236794', 'folder_id=5c2d51b3-8a21-4f10-9dd4-cf0015925bc9', 'module=desk_contacts', 'use_case=ticket.closed', 'starred=true', 'is_starred=true']) { const x = await api('GET', '/desk/email-templates?limit=200&' + q); const l = (D(x.j) || {}).email_templates || []; f[q] = x.s + ' n=' + l.length + ' ' + l.slice(0, 4).map(t => t.name + '/' + (t.department_name || '-') + '/' + (t.folder_name || '-') + '/' + t.module + '/' + t.is_starred).join(' ; '); }
out.filters = f;
const et = D((await api('GET', '/desk/email-templates?limit=200')).j).email_templates.filter(x => /QA GL W4/.test(x.name));
out.mine = et.map(x => x.id + ' ' + x.name + ' star=' + x.is_starred + ' ' + x.subject + ' | ' + x.body_html.slice(0, 200));
for (const x of et) if (!CREATED.find(c => c.id === x.id) && x.id !== ID) CREATED.push({ kind: 'email-template', id: x.id, name: x.name });
return fin({ out });
