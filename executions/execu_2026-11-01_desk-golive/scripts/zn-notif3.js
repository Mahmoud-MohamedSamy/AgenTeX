async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m21/';
  await page.goto('https://desk.zoho.com/agent/wondertravel/all/setup#setup/automation/589783000002142219/notifyrules', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(25000);
  const x = page.locator('text=Desktop Notification').locator('xpath=ancestor::div[3]').locator('text=/^×$/'); if (await x.count()) await x.first().click().catch(() => {});
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  o.head = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').match(/Notification Rules.{0,60}/)?.[0];
  const h = f.getByText('Editing a comment', { exact: true }).first(); o.c = await h.count(); if (o.c) await h.evaluate(e => e.scrollIntoView({ block: 'center' })).catch(() => {});
  await page.waitForTimeout(1500); await page.screenshot({ path: D + 'zoho-notif-qa.png' }); return o; }
