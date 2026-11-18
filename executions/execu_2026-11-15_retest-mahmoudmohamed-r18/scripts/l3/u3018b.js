const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const reqs = [];
page.on('response', async r => { const u = r.url(); const m = r.request().method(); if (/api\/v1/.test(u) && m !== 'GET' && !/heartbeat|notif|iam|resolved-batch|lookups/.test(u)) reqs.push(m + ' ' + u.split('/api/v1')[1].replace(/[0-9a-f-]{36}/g, ':id').slice(0, 80) + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 160)); });
await page.goto(H + '/modules/' + T + '/records/new', { waitUntil: 'domcontentloaded' }); await page.waitForSelector('[data-rule-field]', { timeout: 40000 }).catch(() => {}); await sleep(3000);
const pick = async (field, opt) => { await page.locator(`[data-rule-field="${field}"] button`).first().click(); await sleep(1200); const s = page.locator('[role=listbox] input, [cmdk-input], input[placeholder*="Search" i]').last(); if (await s.count() && await s.isVisible().catch(() => false)) { await s.fill(opt); await sleep(1200); } const o = page.getByRole('option', { name: opt, exact: true }).first(); if (await o.count()) await o.click(); else await page.getByText(opt, { exact: true }).last().click(); await sleep(1500); };
await pick('department', 'QA AO Dept A'); await pick('status', 'Open');
await page.locator('[data-rule-field="email"] input').first().fill('qa-rt18-l3@example.com');
await page.locator('[data-rule-field="subject"] input').first().fill('QA RT18 3018 good subject');
await page.locator('[data-rule-field="description"] textarea').first().fill('QA RT18 BAD desc');
await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(5000);
const R = await page.evaluate(() => {
  const w = document.querySelector('[data-rule-field="description"]'); const i = w && w.querySelector('textarea'); const db = i && i.getAttribute('aria-describedby'); const ids = (db || '').split(/\s+/).filter(Boolean);
  const a = document.activeElement; const fw = a && a.closest('[data-rule-field]');
  return { fieldText: w && w.innerText.replace(/\s+/g, ' ').slice(0, 120), ariaInvalid: i && i.getAttribute('aria-invalid'), describedby: db, describedTexts: ids.map(id => (document.getElementById(id) || {}).innerText), focus: fw ? fw.getAttribute('data-rule-field') : (a && a.tagName),
    live: [...document.querySelectorAll('[role=alert],[role=status],[aria-live]')].map(e => e.tagName + ' role=' + e.getAttribute('role') + ' live=' + e.getAttribute('aria-live') + ' txt=' + e.innerText.replace(/\s+/g, ' ').slice(0, 80)).filter(x => !/txt=$/.test(x)) };
});
log('R', R); await page.locator('[data-rule-field="description"]').scrollIntoViewIfNeeded(); await shot('3018-2-desk-refused-description.png'); log('reqs', reqs);
