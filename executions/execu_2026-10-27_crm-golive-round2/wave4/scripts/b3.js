// Round 2 Wave 4 batch 3: portal on/off in a clean (signed-out) browser context; web form hosted link + embedded form submit.
const RAW = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-10-27_crm-golive-round2/wave4/evidence/raw/';
const HOST = 'https://staging-crm.taviportal.com';
const out = {};
const ctx = await page.context().browser().newContext({ viewport: { width: 1400, height: 900 } });
const pg = await ctx.newPage();
const look = async (u, shot, waitMs) => { await pg.goto(u, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {}); await pg.waitForTimeout(waitMs || 8000); await pg.screenshot({ path: RAW + shot }); return (await pg.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); };
// portal
let p = await call('GET', `/record-portals/${C.portal}`); let pd = p.j.data;
const on = await call('PATCH', `/record-portals/${C.portal}`, { is_enabled: true, row_version: pd.row_version }); out.portalOn = on.s + ' ' + on.t.slice(0, 120);
out.portalOnPage = await look(pd.portal_url, 'tavi-portal-on.png');
p = await call('GET', `/record-portals/${C.portal}`); pd = p.j.data;
const off = await call('PATCH', `/record-portals/${C.portal}`, { is_enabled: false, row_version: pd.row_version }); out.portalOff = off.s + ' ' + off.t.slice(0, 120);
out.portalOffPage = await look(pd.portal_url, 'tavi-portal-off.png');
// web form: hosted link and embedded frame
const f = await call('GET', `/web-forms/${C.form}`); const d = f.j.data;
out.hostedPage = await look(d.share_url, 'tavi-webform-hosted-404.png', 4000);
out.framePage = await look(`${HOST}/embed/feedback/index.html?key=${d.embed_key}&mode=frame`, 'tavi-webform-embedded.png');
// fill the embedded form (no captcha) and submit
const T = Date.now() % 100000; const name = 'QA R2W4 Web ' + T;
const inputs = pg.locator('input, textarea');
out.inputCount = await inputs.count();
const labels = [];
for (let i = 0; i < out.inputCount; i++) { const el = inputs.nth(i); labels.push((await el.getAttribute('name')) + '|' + (await el.getAttribute('type')) + '|' + (await el.getAttribute('aria-label') || '')); }
out.inputs = labels;
const fill = async (re, v) => { for (let i = 0; i < out.inputCount; i++) { const el = inputs.nth(i); const n = ((await el.getAttribute('name')) || '') + ((await el.getAttribute('aria-label')) || '') + ((await el.getAttribute('id')) || ''); if (re.test(n)) { await el.fill(v); return true; } } return false; };
out.filled = [await fill(/first_name|full.?name|name/i, name), await fill(/phone/i, '0101' + String(2000000 + T).slice(0, 7)), await fill(/email/i, 'mmohamed@anyware.software'), await fill(/company/i, 'QA R2W4 Web Co')];
await pg.screenshot({ path: RAW + 'tavi-webform-filled.png' });
const btn = pg.getByRole('button', { name: /submit|send/i }).first();
out.hasSubmit = await btn.count();
if (out.hasSubmit) { await btn.click(); await pg.waitForTimeout(6000); }
out.afterSubmit = (await pg.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
await pg.screenshot({ path: RAW + 'tavi-webform-submitted.png' });
await ctx.close();
// the lead it created
await page.waitForTimeout(5000);
const r = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=20&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
const hit = (r.j.data || []).find(x => JSON.stringify(x).includes(name));
out.leadCreated = !!hit; out.leadId = hit && hit.id;
if (hit) { const v = k => { const e = hit.data.find(z => z.field === k); return e && e.value && e.value.value; }; out.leadValues = { first_name: v('first_name'), phone: v('phone'), email: v('email'), company: v('company'), owner: JSON.stringify(v('owner')), source: hit.source || v('lead_source') }; }
const subs = await call('GET', `/web-forms/${C.form}/submissions`); out.submissions = subs.s + ' ' + subs.t.slice(0, 300);
out.name = name;
return out;
