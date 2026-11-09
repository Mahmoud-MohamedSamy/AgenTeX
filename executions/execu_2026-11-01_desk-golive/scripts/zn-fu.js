async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m20/';
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup#setup/automation/589783000024333569/workflows/fieldupdates', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(25000);
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  o.t = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').match(/Field Updates.{0,700}/)?.[0];
  await page.screenshot({ path: D + 'zoho-fu-list.png' }); return o; }
