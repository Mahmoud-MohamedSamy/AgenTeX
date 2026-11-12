async (page) => { const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const R = {};
  await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000);
  await page.getByText('QA LR1112 user', { exact: true }).first().click(); await sleep(5000);
  R.url = page.url(); R.txt = (await bodyText()).slice(0, 1500); await shot('crm-D5-editor');
  return R; }
