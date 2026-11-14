async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.getByPlaceholder('Search Preferences').fill('Signature'); await sleep(3000);
  o.res = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Search Preferences.{0,400}/)?.[0];
  await page.screenshot({ path: S + 'z-pref-signature-search.png' }); return o; }
