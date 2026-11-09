async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m21/';
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  const h = f.getByText('Team Notifications', { exact: true }).first(); o.c = await h.count(); if (o.c) await h.evaluate(e => e.scrollIntoView({ block: 'start' })).catch(() => {});
  await page.mouse.move(900, 500); await page.mouse.wheel(0, -60); await page.waitForTimeout(1500); await page.screenshot({ path: D + 'zoho-notif-qa-team.png' }); return o; }
