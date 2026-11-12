// A2 as "Customer Experience Specialists 2" while on Desk Light Agent: menu items and the three pages by URL.
module.exports = async (h) => {
  const { page, shot, log, go } = h;
  const net = []; page.on('response', r => { if (/\/workflow\/(rules|actions|executions)/.test(r.url())) net.push(r.status() + ' ' + r.url().split('/api/v1')[1].slice(0, 60)); });
  await go('/settings'); await page.waitForTimeout(2500);
  const side = await page.locator('body').innerText(); log('menu_has', ['Workflow Rules', 'Actions', 'Execution History', 'Custom Actions'].filter(x => side.includes(x)));
  for (const p of ['/settings/automation/workflow-rules', '/settings/automation/actions', '/settings/workflow-executions']) {
    net.length = 0; await go(p); await page.waitForTimeout(3000);
    const t = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
    log(p, { url: page.url().replace(/^https:\/\/[^/]+/, ''), text: t.slice(0, 220), hasRuleData: /QA NDC|Recurring|Fired|No match/.test(t), net: net.slice(0, 4) });
    await shot('a2-' + p.split('/').pop());
  }
};
