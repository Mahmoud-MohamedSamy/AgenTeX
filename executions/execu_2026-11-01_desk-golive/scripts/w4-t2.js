const out = { neg: [] };
const msgs = async () => (await page.locator('[data-sonner-toast],[role=alert],.text-destructive,[aria-invalid=true]').evaluateAll(es => es.map(e => (e.innerText || e.getAttribute('aria-label') || e.tagName).trim()))).filter(Boolean).slice(0, 6);
const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.t.slice(0, 260));
const form = async () => { await go('/settings/organization/email-templates/new', 10000); };
const sel = async (label, opt) => { const s = page.locator('main select').filter({ has: page.locator('option', { hasText: opt }) }).first(); await s.selectOption({ label: opt }); };
// New folder
await go('/settings/organization/email-templates', 10000);
let n0 = NET.length;
await page.getByRole('button', { name: /^New template folder$/ }).click(); await sleep(2000);
const fd = page.locator('[role=dialog]').last(); out.folderDlg = (await fd.innerText()).replace(/\s+/g, ' ').slice(0, 500);
await fd.locator('input').first().fill('QA GL W4 folder'); await fd.getByRole('button', { name: /^(Save|Create)/ }).last().click(); await sleep(3000);
out.folderNet = nn(n0);
// negative: empty name
await form(); n0 = NET.length; await page.locator('#desk-email-template-subject').fill('QA GL W4 subj'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(2500); out.neg.push({ k: 'empty name', m: await msgs(), net: nn(n0) });
// negative: empty subject
await form(); n0 = NET.length; await page.locator('main input[type=text]').nth(0).fill('QA GL W4 nosubj'); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3000); out.neg.push({ k: 'empty subject', m: await msgs(), net: nn(n0) }); await shot('w4/W4-27-empty-subject');
// valid create
await form(); n0 = NET.length;
await page.locator('main input[type=text]').nth(0).fill('QA GL W4 template');
await sel('Folder', 'QA GL W4 folder').catch(e => out.neg.push('folder sel ' + e.message.slice(0, 80)));
await sel('Department', 'Marketing').catch(e => out.neg.push('dept sel ' + e.message.slice(0, 80)));
await page.locator('#desk-email-template-subject').fill('QA GL W4 [#{{ticket.number}}] {{ticket.subject}}');
const ed = page.locator('[role=textbox][aria-label=Message], main [contenteditable=true]').first(); await ed.click(); await page.keyboard.type('Hello {{contact.name}}, this is QA GL W4 about ticket {{ticket.number}} with status {{ticket.status}}.');
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(4000);
out.create = { m: await msgs(), net: nn(n0), url: page.url() };
const et = D((await api('GET', '/desk/email-templates?limit=200')).j).email_templates.filter(x => /QA GL W4/.test(x.name));
out.mine = et.map(x => JSON.stringify({ id: x.id, name: x.name, dept: x.department_name, folder: x.folder_name, subject: x.subject, body: x.body_html, active: x.is_active }));
for (const x of et) CREATED.push({ kind: 'email-template', id: x.id, name: x.name });
const fl = D((await api('GET', '/desk/email-templates/folders')).j).folders.filter(x => /QA GL W4/.test(x.name)); for (const x of fl) CREATED.push({ kind: 'email-template-folder', id: x.id, name: x.name });
return fin({ out });
