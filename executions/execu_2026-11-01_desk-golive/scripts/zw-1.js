async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.waitForTimeout(8000); o.url = page.url();
  const np = page.locator('text=/^Not Now$/'); if (await np.count()) await np.first().click().catch(() => {});
  o.rows = (await page.innerText('body')).replace(/\s+/g, ' ').match(/All Tickets.{0,900}/)?.[0];
  await page.screenshot({ path: S + 'z-list.png' });
  return o; }
