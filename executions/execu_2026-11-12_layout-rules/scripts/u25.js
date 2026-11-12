async (page) => { const R = {};
  const row = page.locator('tr', { hasText: 'QA LR1112 user' }); R.btns = await row.locator('button').count();
  await row.locator('button').nth(R.btns >= 3 ? R.btns - 2 : 0).click(); await sleep(5000);
  R.url = page.url(); const t = await bodyText(); const i = t.indexOf('Lead Owner'); R.txt = t.slice(Math.max(0,i-300), i + 900); await shot('crm-D5-editor');
  return R; }
