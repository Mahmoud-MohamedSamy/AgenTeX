async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m21/';
  await page.getByText('Notification Rules', { exact: true }).first().click({ timeout: 8000 }).catch(e => o.e = e.message.slice(0, 50)); await page.waitForTimeout(8000);
  o.url = page.url(); const f = page.frames().find(z => /ShowHomePage\.do/.test(z.url())) || page.mainFrame();
  const t = (await f.innerText('body').catch(() => '')).replace(/\s+/g, ' '); const i = t.search(/Team Notification/i); o.t = t.slice(Math.max(0, i - 200), i + 500);
  await page.screenshot({ path: D + 'zoho-notif.png' }); return o; }
