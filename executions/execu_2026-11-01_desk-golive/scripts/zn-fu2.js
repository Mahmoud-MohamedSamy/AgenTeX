async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m20/';
  const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  const r = f.getByText('Ticket owner -1', { exact: true }).first(); o.n = await r.count(); if (o.n) { await r.click().catch(e => o.e = e.message.slice(0, 60)); await page.waitForTimeout(5000); }
  o.t = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' ').match(/(Edit Field Update|Field Update).{0,500}/)?.[0];
  await page.screenshot({ path: D + 'zoho-fu-detail.png' }); return o; }
