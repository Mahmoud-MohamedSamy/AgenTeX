async (page) => {
  const E = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-08_desk-automation-order/evidence/a4-bugs/';
  const out = {};
  for (const [n, id] of [['185', '1475109000000570585'], ['184', '1475109000000570515']]) {
    await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/' + id + '/history', { waitUntil: 'domcontentloaded' });
    for (let k = 0; k < 30; k++) { await page.waitForTimeout(1000); const t = await page.locator('body').innerText().catch(() => ''); if (/Notification|Workflow|Status/.test(t.split('HISTORY').slice(1).join(''))) break; }
    await page.waitForTimeout(2000);
    await page.screenshot({ path: E + 'C3-zoho-' + (n === '185' ? 'workflow-close-no-mail' : 'manual-close-mail-sent') + '.png' });
    out[n] = (await page.locator('body').innerText()).split('HISTORY').slice(1).join('').replace(/\n+/g, ' | ').slice(0, 600);
  }
  return out;
}
