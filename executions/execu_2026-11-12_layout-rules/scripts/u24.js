async (page) => { const R = {};
  await page.locator('tr:has-text("QA LR1112 user") button').first().click(); await sleep(5000);
  R.url = page.url(); const t = await bodyText(); R.txt = t.slice(t.indexOf('Primary field'), t.indexOf('Primary field') + 900); await shot('crm-D5-editor');
  return R; }
