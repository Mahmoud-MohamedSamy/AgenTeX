// Round 2 Wave 4 batch 4: compose on the QA lead (recipient mahmoud.mmohamedsamy@gmail.com), read the sender choices, send once with the QA template.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave4/evidence/raw/';
const out = {};
await page.goto(`https://staging-crm.taviportal.com/modules/${MODS.leads}/records/${C.lead}`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 120; i++) { await page.waitForTimeout(1000); const t = await page.innerText('body').catch(() => ''); if (t.includes('Send Email')) break; }
await page.getByRole('button', { name: 'Send Email' }).first().click();
await page.waitForTimeout(5000);
const d = page.locator('[role=dialog]').last();
out.dialog = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 700);
const sels = d.locator('select'); out.selects = [];
for (let i = 0; i < await sels.count(); i++) out.selects.push(await sels.nth(i).evaluate(s => [...s.options].map(o => o.text).join(' | ')));
await page.screenshot({ path: RAW + 'tavi-compose-open.png' });
// pick the QA template if offered
for (let i = 0; i < await sels.count(); i++) { const opts = await sels.nth(i).evaluate(s => [...s.options].map(o => o.text)); const t = opts.find(o => /QA R2W4 Template ok/.test(o)); if (t) { await sels.nth(i).selectOption({ label: t }); out.templatePicked = t; } }
await page.waitForTimeout(2500);
out.subject = await d.getByRole('textbox', { name: 'Subject' }).inputValue().catch(() => null);
out.body = (await d.getByRole('textbox', { name: 'Message' }).innerText().catch(() => '')).slice(0, 300);
await page.screenshot({ path: RAW + 'tavi-compose-filled.png' });
const sends = [];
const on = r => { if (r.url().includes('/api/v1/emails') && r.request().method() === 'POST') sends.push(r.status()); };
page.on('response', on);
await d.getByRole('button', { name: /^Send$/ }).first().click().catch(e => out.sendErr = e.message.slice(0, 100));
await page.waitForTimeout(8000);
page.off('response', on);
out.sendStatus = sends;
out.toast = ((await page.innerText('body').catch(() => '')).match(/(Email sent|Sent|failed[^.]{0,80}|couldn't[^.]{0,80}|not sent[^.]{0,80})/gi) || []).slice(0, 5);
await page.screenshot({ path: RAW + 'tavi-compose-after-send.png' });
await page.waitForTimeout(20000);
const em = await call('GET', `/mail/records/leads/${C.lead}/emails`);
const list = (em.j && em.j.data && (em.j.data.items || em.j.data.emails || em.j.data)) || [];
out.recordEmails = em.s + ' ' + JSON.stringify(list).slice(0, 700);
const first = Array.isArray(list) && list[0];
if (first && first.id) { const g = await call('GET', `/mail/emails/${first.id}`); out.emailDetail = JSON.stringify(g.j && g.j.data).replace(/"body_html":"[^"]*"/, '"body_html":"…"').slice(0, 700); }
const tl = await call('GET', `/timeline/records/leads/${C.lead}/feed`);
out.timeline = ((tl.j.data && tl.j.data.data) || []).map(e => e.entry_type).slice(0, 12);
await page.reload({ waitUntil: 'domcontentloaded' }); await page.waitForTimeout(12000);
await page.getByRole('tab', { name: /Mails|Emails/i }).first().click().catch(() => {}); await page.waitForTimeout(5000);
out.mailsTab = (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
await page.screenshot({ path: RAW + 'tavi-mails-tab.png' });
return out;
