async (page) => { const E='D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-12_desk-skills-parity/evidence/zoho/';
 for (const [id, f] of [['1475109000000570263','zoho-182-no-skills.png'],['1475109000000529517','zoho-170-manual-dropped.png']]) {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/' + id, { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(11000);
  await page.screenshot({ path: E + f }); }
 return 'ok'; }
