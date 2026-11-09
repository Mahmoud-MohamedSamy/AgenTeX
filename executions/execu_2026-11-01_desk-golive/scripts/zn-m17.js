async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m17/';
  const closeN = async () => { const x = page.locator('text=Desktop Notification').locator('xpath=ancestor::div[3]').locator('text=/^×$/'); if (await x.count()) await x.first().click().catch(() => {}); };
  await page.goto('https://desk.zoho.com/agent/wondertravel/accounting/tickets/new', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(18000); await closeN();
  const t = (await page.innerText('body')).replace(/\s+/g, ' '); o.head = t.match(/Add Ticket.{0,300}/)?.[0];
  await page.screenshot({ path: D + 'zoho-acc-new.png' });
  const lay = page.locator('text=/^(Layout|Choose Layout|Accounting)\s*$/'); o.layCount = await lay.count();
  return o; }
