async (page) => { await page.goto('https://desk.zoho.com/agent/wondertravel/all/tickets/list/all-cases', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(25000); await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m20/zoho-home.png' });
  return { url: page.url(), t: (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 300) }; }
