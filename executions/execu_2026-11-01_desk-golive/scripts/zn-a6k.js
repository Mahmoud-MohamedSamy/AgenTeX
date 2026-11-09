async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/a6/';
  await page.goto('https://desk.zoho.com/agent/wondertravel/fly-wt-refund/tickets/new', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(18000);
  o.t = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Ticket Information.{0,400}/)?.[0];
  await page.screenshot({ path: D + 'zoho-new-fly.png' }); return o; }
