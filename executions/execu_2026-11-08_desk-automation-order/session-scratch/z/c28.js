async (page) => {
  const E = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-08_desk-automation-order/evidence/a4-bugs/';
  const shots = {};
  for (const [n, id] of [['185', '1475109000000570585'], ['184', '1475109000000570515']]) {
    await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/' + id + '/history', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(12000);
    const p = E + 'C3-zoho-' + (n === '185' ? 'workflow-close-no-mail' : 'manual-close-mail-sent') + '.png';
    await page.screenshot({ path: p }); shots[n] = p;
  }
  return shots;
}
