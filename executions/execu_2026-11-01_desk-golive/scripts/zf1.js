(async (page) => { const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/'; const o = {};
  await page.getByText('Audit Log', { exact: true }).first().click().catch(e => o.clickErr = e.message.slice(0, 100));
  await page.waitForTimeout(15000);
  o.url = page.url(); const t = (await page.innerText('body')).replace(/\s+/g, ' '); const i = t.indexOf('Audit'); o.text = t.slice(i, i + 2500);
  await page.screenshot({ path: R + 'zoho-B4-1-audit.png' });
  return o; })
