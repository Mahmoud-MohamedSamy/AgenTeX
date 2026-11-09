// Round 2 Wave 4 batch 9: capture the public web-form requests (one clean submission with the hidden field filled), reminder 2.
const HOST = 'https://staging-crm.taviportal.com';
const out = { now: new Date().toISOString() };
const f = await call('GET', `/web-forms/${C.form}`); const d = f.j.data;
const ctx = await page.context().browser().newContext(); const pg = await ctx.newPage();
const reqs = [];
pg.on('request', r => { if (r.url().includes('/api/v1/')) reqs.push({ m: r.method(), u: r.url().replace(/^.*\/api\/v1/, ''), h: Object.keys(r.headers()).filter(k => /web-form|session/i.test(k)), b: (r.postData() || '').replace(/"session_token":"[^"]+"/, '"session_token":"…"').slice(0, 600) }); });
pg.on('response', r => { if (r.url().includes('/api/v1/')) reqs.push({ status: r.status(), u: r.url().replace(/^.*\/api\/v1/, '') }); });
await pg.goto(`${HOST}/embed/feedback/index.html?key=${d.embed_key}&mode=frame`, { waitUntil: 'domcontentloaded' }); await pg.waitForTimeout(6000);
const hp = await pg.locator('input').first().getAttribute('name');
await pg.locator(`input[name="${hp}"]`).fill('bot');
await pg.locator('input[name="first_name"]').fill('QA R2W4 Spam 3'); await pg.locator('input[name="phone"]').fill('01015550004');
await pg.getByRole('button', { name: /send/i }).first().click(); await pg.waitForTimeout(6000);
await ctx.close();
out.requests = reqs.map(r => JSON.stringify(r).replace(/fw1\.[A-Za-z0-9_.-]+/g, 'KEY'));
const n = await call('GET', '/notifications?limit=50');
const items = (n.j && n.j.data && (n.j.data.data || n.j.data.items || n.j.data)) || [];
out.reminders = items.filter(x => /reminder/.test(x.event_type) && /QA R2W4/.test(JSON.stringify(x))).map(x => x.event_type + ' | ' + x.title + ' | ' + x.created_at);
return out;
