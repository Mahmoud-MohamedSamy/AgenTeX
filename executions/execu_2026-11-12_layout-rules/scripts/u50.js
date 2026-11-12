async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /New Layout Rule/ }).click(); await sleep(4000);
  R.inputs = await page.evaluate(() => [...document.querySelectorAll('input,textarea,button[role=combobox],button[role=switch]')].filter(e => e.getBoundingClientRect().height > 0).map(e => e.tagName + '|' + (e.getAttribute('role') || e.type) + '|' + (e.placeholder || e.getAttribute('aria-label') || e.innerText || '').slice(0, 40)).slice(0, 30));
  return R; }
