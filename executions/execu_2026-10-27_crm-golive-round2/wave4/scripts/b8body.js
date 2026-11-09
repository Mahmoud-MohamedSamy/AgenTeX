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
