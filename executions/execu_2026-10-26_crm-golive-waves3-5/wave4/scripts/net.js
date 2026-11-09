// Opens each page in PAGES (global, set by the caller line) and records /api/v1 calls with status.
const out = {};
for (const p of PAGES) {
  const calls = [];
  const on = r => { const u = r.url(); if (u.includes('/api/v1/')) calls.push(r.request().method() + ' ' + r.status() + ' ' + u.replace(/^.*\/api\/v1/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}').slice(0, 140)); };
  page.on('response', on);
  await page.goto('https://staging-crm.taviportal.com' + p, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => calls.push('GOTO ' + e.message.slice(0, 80)));
  await page.waitForTimeout(typeof WAIT === "number" ? WAIT : 25000);
  page.off('response', on);
  out[p] = { calls: [...new Set(calls)], text: (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 900) };
}
return out;
