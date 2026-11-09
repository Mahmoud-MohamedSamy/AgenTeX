(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/haytham-mohamed/setup#setup/usermanagement/agents', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(15000);
  o.url1 = page.url(); o.list = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Agents.{0,600}/)?.[0];
  await page.screenshot({ path: R + 'zoho-B3-1-agents.png' });
  const btn = page.getByRole('button', { name: /new agent|add agent/i }); o.btn = await btn.count();
  if (!o.btn) { const t = page.getByText(/New Agent|Add Agent/).first(); if (await t.count()) await t.click().catch(() => {}); } else await btn.first().click().catch(() => {});
  await page.waitForTimeout(8000);
  o.url2 = page.url(); o.form = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 1500);
  o.inputs = await page.$$eval('input', is => is.filter(i => i.offsetParent).map(i => (i.id || '') + '|' + (i.name || '') + '|' + (i.placeholder || '') + '|' + i.type).slice(0, 30));
  await page.screenshot({ path: R + 'zoho-B3-2-new-agent-form.png' });
  return o; })
