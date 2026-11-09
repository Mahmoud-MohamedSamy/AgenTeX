const C = {lead:'a8aaba4b-b332-49e6-a44c-b1a1aaeef287', template:'null', template2:'33854615-e46c-45d0-ba37-8e5bc0fcdfea', form:'ffc11512-870e-48d8-b8e8-971a0c056d8a', formCaptcha:'8dbb3e94-94bb-410c-bac8-63663c5041e3', portal:'bf87e0e1-c7c1-4e99-9d06-74a472a3e5de', task:'36dced7d-fb31-49e4-8eb9-78643bd9a8be'};
// Round 2 Wave 4 batch 7: email providers (Gmail/M365 connect, cancelled), Activity Reminders scroll areas, spam trap re-check, reminder 2.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave4/evidence/raw/';
const HOST = 'https://staging-crm.taviportal.com';
const out = { now: new Date().toISOString() };
const open = async (p, needle) => { await page.goto(HOST + p, { waitUntil: 'domcontentloaded' }); let t = ''; for (let i = 0; i < 45; i++) { await page.waitForTimeout(1000); t = await page.innerText('body').catch(() => ''); if ((!needle || t.includes(needle)) && !/Loading/.test(t)) break; } await page.waitForTimeout(1500); return t; };
// email providers
let t = await open('/settings/integrations/email', 'Connect');
await page.screenshot({ path: RAW + 't-email-integrations.png' });
out.emailPage = t.slice(t.indexOf('Email') , t.indexOf('Email') + 500).replace(/\s+/g, ' ');
const tryProvider = async (label, extra) => {
  const c = page.getByRole('button', { name: /connect a provider|connect/i }).first(); if (!(await c.count())) return 'no connect button';
  await c.click(); await page.waitForTimeout(2500);
  const opt = page.getByText(label, { exact: false }).first(); if (!(await opt.count())) { await page.keyboard.press('Escape'); return 'no option ' + label; }
  await opt.click(); await page.waitForTimeout(1500);
  if (extra) { const inp = page.locator('[role=dialog] input[type=text], [role=dialog] input:not([type])').first(); if (await inp.count()) await inp.fill(extra); }
  const go = page.getByRole('button', { name: /continue to sign in|continue|connect/i }).last(); if (await go.count()) await go.click().catch(() => {});
  await page.waitForTimeout(5000);
  const msg = ((await page.locator('[role=dialog]').last().innerText().catch(() => '')) + ' ' + ((await page.locator('[role=alert],[data-sonner-toast]').allInnerTexts().catch(() => [])).join(' '))).replace(/\s+/g, ' ');
  await page.screenshot({ path: RAW + 't-connect-' + label.replace(/\W+/g, '-').toLowerCase() + '.png' });
  out.urlAfter = page.url();
  await page.keyboard.press('Escape'); await page.waitForTimeout(1000);
  if (!page.url().startsWith(HOST)) { await page.goBack().catch(() => {}); }
  const cancel = page.getByRole('button', { name: /cancel|close/i }).first(); if (await cancel.count()) await cancel.click().catch(() => {});
  return msg.slice(0, 500);
};
out.gmail = await tryProvider('Google');
await open('/settings/integrations/email', 'Connect');
out.m365 = await tryProvider('Microsoft 365', 'anyware.software');
const conns = await call('GET', '/mail/connections'); out.connectionsAfter = (conns.j.data || []).length;
// activity reminders: count scroll areas
await open('/settings/activity-reminders', 'Reminder');
out.scrollAreas = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => { const s = getComputedStyle(e); return /(auto|scroll)/.test(s.overflowY) && e.scrollHeight > e.clientHeight + 5 && e.clientHeight > 100; }).map(e => e.tagName + '.' + String(e.className).slice(0, 40) + ' ' + e.clientHeight + '/' + e.scrollHeight));
await page.screenshot({ path: RAW + 't-activity-reminders.png' });
// spam trap re-check from scratch: a new submission with only the hidden field filled differently
const f = await call('GET', `/web-forms/${C.form}`); const d = f.j.data;
const ctx = await page.context().browser().newContext(); const pg = await ctx.newPage();
await pg.goto(`${HOST}/embed/feedback/index.html?key=${d.embed_key}&mode=frame`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
const hp = await pg.locator('input').first().getAttribute('name');
out.honeypotLabel = (await pg.locator('label').first().innerText().catch(() => '')).slice(0, 60);
await pg.locator(`input[name="${hp}"]`).fill('http://spam.example');
await pg.locator('input[name="first_name"]').fill('QA R2W4 Spam 2'); await pg.locator('input[name="phone"]').fill('01015550003');
await pg.getByRole('button', { name: /send/i }).first().click(); await pg.waitForTimeout(6000);
out.spam2 = (await pg.innerText('body')).replace(/\s+/g, ' ').slice(0, 200);
await ctx.close(); await page.waitForTimeout(4000);
const r = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=30&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
out.spam2Lead = (r.j.data || []).filter(x => /QA R2W4 Spam 2/.test(JSON.stringify(x))).map(x => x.id);
// reminder 2
const n = await call('GET', '/notifications?limit=50');
const items = (n.j && n.j.data && (n.j.data.data || n.j.data.items || n.j.data)) || [];
out.reminders = items.filter(x => /reminder/.test(x.event_type) && /QA R2W4/.test(JSON.stringify(x))).map(x => x.event_type + ' | ' + x.title + ' | ' + x.created_at);
return out;
