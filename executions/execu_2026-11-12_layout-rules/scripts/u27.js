async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  const openEd = async name => { await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(5000); const row = page.locator('tr', { hasText: name }); await row.locator('button').nth(1).click(); await sleep(5000); };
  const prev = async () => { const t = await bodyText(); const i = t.indexOf('Preview'); return t.slice(i, i + 1600); };
  await openEd('QA LR1112 basic'); R.basicPrev = await prev(); await shot('crm-L1');
  R.selects = await page.locator('button[role=combobox]').allInnerTexts();
  return R; }
