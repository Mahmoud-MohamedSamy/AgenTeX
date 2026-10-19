const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = 'af53a145-166a-40b2-8f94-ce56fc69a07f'; const out = { calls: [] };
const lm = async () => { const g = await api('GET', '/modules/' + L + '/records/' + R); const d = g.j.data; return { last_modified_at: d.last_modified_at || d.lastModifiedAt, fieldLA: JSON.stringify(((d.data || []).find(f => /last_activity|modified_at/.test(f.field)) || {}).value) }; };
out.before = await lm();
const fr = async r => { const m = r.request().method(); if (m !== 'GET' && /note|timeline|activit/i.test(r.url())) out.calls.push(r.status() + ' ' + m + ' ' + r.url().replace(API, '')); }; page.on('response', fr);
await page.goto(H + '/modules/' + L + '/records/' + R, { waitUntil: 'commit', timeout: 120000 }); await sleep(12000);
await shot('NDC-2104-record-before-note');
const tabs = await page.getByRole('tab').allInnerTexts().catch(() => []); out.tabs = tabs.slice(0, 12);
const n = page.getByRole('tab', { name: /Notes/i }).first(); if (await n.count()) { await n.click(); await sleep(2500); }
const box = page.locator('textarea, [contenteditable=true]').filter({ hasNot: page.locator('input') }).first();
out.noteBox = await box.count();
if (out.noteBox) { await box.click(); await box.fill('QA RT note for NDC-2104 retest'); await sleep(500);
  const sb = page.getByRole('button', { name: /^(Save|Add note|Post|Add)$/i }).first(); out.saveBtn = await sb.count(); if (out.saveBtn) { await sb.click(); await sleep(5000); } }
await shot('NDC-2104-record-after-note');
page.off('response', fr);
out.after = await lm();
return done(out);
