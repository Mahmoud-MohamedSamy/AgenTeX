async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  await page.keyboard.press('Escape').catch(() => {});
  await page.goto('https://desk.zoho.com/agent/wondertravel/manual-invoice/setup#setup/customization/Cases/pagelayout', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(18000);
  const f = page.frames().find(x => /ShowHomePage\.do/.test(x.url())) || page.mainFrame();
  o.text = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').match(/Layouts Tickets.{0,250}/)?.[0];
  await page.screenshot({ path: D + 'zoho-layouts-mi.png' }); return o; }
