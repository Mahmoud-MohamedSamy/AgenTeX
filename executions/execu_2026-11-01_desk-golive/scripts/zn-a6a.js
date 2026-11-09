async (page) => { const o = {};
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup#setup/customization/Cases/pagelayout', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(15000);
  o.url = page.url(); o.text = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 600);
  await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/zoho-layouts.png' });
  return o; }
