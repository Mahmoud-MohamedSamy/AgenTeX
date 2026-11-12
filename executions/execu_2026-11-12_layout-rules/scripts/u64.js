async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=validation-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  const nb = page.getByRole('button', { name: /New Validation Rule|New rule|Create/i }).first(); R.nb = await nb.count(); if (R.nb) { await nb.click(); await sleep(4000); }
  const t = await bodyText(); const i = t.indexOf('Validation Rule'); R.t = t.slice(i, i + 900);
  R.ctrls = await page.evaluate(() => [...(document.querySelector('main') || document.body).querySelectorAll('input,textarea,button[aria-haspopup],button[role=combobox]')].filter(e => e.getBoundingClientRect().height > 0).map(e => e.tagName + '|' + (e.placeholder || e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40)));
  await shot('crm-H6-new'); return R; }
