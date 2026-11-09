(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  const b = page.getByRole('button', { name: 'New Agent' }).first(); o.b = await b.count();
  const box = await b.boundingBox().catch(() => null); o.box = box;
  if (box) { await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2); }
  await page.waitForTimeout(12000);
  o.url = page.url();
  o.inputs = await page.$$eval('input, textarea', is => is.filter(i => i.offsetParent).map(i => (i.id || '') + '|' + (i.name || '') + '|' + (i.placeholder || '') + '|' + i.type).slice(0, 30));
  await page.screenshot({ path: R + 'zoho-B3-2-new-agent-form.png' });
  return o; })
