const C = {lead:'a8aaba4b-b332-49e6-a44c-b1a1aaeef287', template:'null', template2:'33854615-e46c-45d0-ba37-8e5bc0fcdfea', form:'ffc11512-870e-48d8-b8e8-971a0c056d8a', formCaptcha:'8dbb3e94-94bb-410c-bac8-63663c5041e3', portal:'bf87e0e1-c7c1-4e99-9d06-74a472a3e5de', task:'36dced7d-fb31-49e4-8eb9-78643bd9a8be'};
// Round 2 Wave 4 batch 6: Signals full text, reminder re-check task, web-form spam trap + duplicate, captcha form, builder and SMS screens.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave4/evidence/raw/';
const HOST = 'https://staging-crm.taviportal.com';
const s = v => ({ kind: 'string', value: v });
const out = { now: new Date().toISOString() };
// Signals: full page text
await page.goto(HOST + '/settings/notifications/preferences', { waitUntil: 'domcontentloaded' });
let sig = ''; for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); sig = await page.innerText('body').catch(() => ''); if (sig.includes('Per-signal delivery') && !sig.includes('Loading')) break; }
const tbl = sig.slice(sig.indexOf('Per-signal delivery'));
out.signalNames = tbl.split('\n').map(x => x.trim()).filter(x => x && !/^(In-app|Email|WhatsApp|SMS|Signal)$/.test(x)).slice(0, 80);
out.rawKeysOnScreen = (tbl.match(/[a-z_]+\.[a-z_]+(\.[a-z_*]+)*/g) || []).filter(k => !/\.(com|software)$/.test(k)).slice(0, 30);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(1000); await page.screenshot({ path: RAW + 't-signals-bottom.png', fullPage: false });
// reminder re-check: due in 12 min, reminder 5 min before
const due = new Date(Date.now() + 12 * 60000); due.setSeconds(0, 0);
const tk = await call('POST', `/modules/${MODS.tasks}/records`, { layout_id: '40c084f2-f062-45d5-ac70-132a7597fac0', data: [{ field: 'name', value: s('QA R2W4 Reminder 2') }, { field: 'subject', value: s('QA R2W4 Reminder 2') }, { field: 'status', value: s('Not Started') }, { field: 'due_date', value: s(due.toISOString().replace('.000', '')) }, { field: 'reminder_offset_minutes', value: s('5') }] });
out.task2 = tk.s; out.task2Id = tk.j && tk.j.data && tk.j.data.id; out.task2Due = due.toISOString();
// web form: spam trap filled, then a duplicate of the earlier submission
const f = await call('GET', `/web-forms/${C.form}`); const d = f.j.data;
const ctx = await page.context().browser().newContext({ viewport: { width: 1400, height: 900 } }); const pg = await ctx.newPage();
const submit = async (vals, shotName) => { await pg.goto(`${HOST}/embed/feedback/index.html?key=${d.embed_key}&mode=frame`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
  for (const [n, v] of Object.entries(vals)) { const el = pg.locator(`input[name="${n}"]`); if (await el.count()) await el.fill(v); }
  await pg.getByRole('button', { name: /send|submit/i }).first().click(); await pg.waitForTimeout(6000); await pg.screenshot({ path: RAW + shotName }); return (await pg.innerText('body')).replace(/\s+/g, ' ').slice(0, 250); };
const hp = await pg.goto(`${HOST}/embed/feedback/index.html?key=${d.embed_key}&mode=frame`).then(() => pg.waitForTimeout(5000)).then(() => pg.locator('input').first().getAttribute('name'));
out.honeypotName = hp;
out.spamResult = await submit({ [hp]: 'i am a bot', first_name: 'QA R2W4 Spam', phone: '01015550001', email: 'mmohamed@anyware.software', company: 'Spam Co' }, 'tavi-webform-spam.png');
out.dupResult = await submit({ first_name: 'QA R2W4 Web dup', phone: '01015550002', email: 'mmohamed@anyware.software', company: 'QA R2W4 Web Co' }, 'tavi-webform-dup.png');
// captcha form: does the challenge show?
const fc = await call('GET', `/web-forms/${C.formCaptcha}`);
await pg.goto(`${HOST}/embed/feedback/index.html?key=${fc.j.data.embed_key}&mode=frame`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(8000);
out.captchaForm = (await pg.innerText('body')).replace(/\s+/g, ' ').slice(0, 250); out.captchaFrames = pg.frames().map(fr => fr.url().slice(0, 60)).filter(u => /turnstile|captcha|cloudflare/i.test(u));
await pg.screenshot({ path: RAW + 'tavi-webform-captcha.png' });
await ctx.close();
await page.waitForTimeout(4000);
const subs = await call('GET', `/web-forms/${C.form}/submissions`); out.submissions = JSON.stringify((subs.j.data.submissions || []).map(x => x.status + ' ' + x.record_id)).slice(0, 400);
const r = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=30&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
out.qaLeads = (r.j.data || []).filter(x => /QA R2W4/.test(JSON.stringify(x))).map(x => x.id + ' ' + ((x.data.find(e => e.field === 'first_name') || {}).value || {}).value);
// builder + SMS screens
const shot = async (p, name, needle) => { await page.goto(HOST + p, { waitUntil: 'domcontentloaded' }); let t = ''; for (let i = 0; i < 40; i++) { await page.waitForTimeout(1000); t = await page.innerText('body').catch(() => ''); if ((!needle || t.includes(needle)) && !/Loading/.test(t)) break; } await page.waitForTimeout(1500); await page.screenshot({ path: RAW + name + '.png' }); const i0 = t.indexOf(needle || ''); return t.slice(Math.max(0, i0), i0 + 700).replace(/\s+/g, ' '); };
out.formList = await shot('/settings/web-forms', 't-web-forms', 'QA R2W4');
out.smsPage = await shot('/settings/sms', 't-sms', 'SMS');
out.templatesPage = await shot('/settings/integrations/email-templates', 't-email-templates', 'Templates');
return out;
