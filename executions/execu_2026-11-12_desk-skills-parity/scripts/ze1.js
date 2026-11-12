async (page) => { const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/remaining/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000579027', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(9000); await page.screenshot({ path: S + 'zoho-189-ticket.png' }); return page.url(); }
