(async (page) => { await page.getByText('Marketing', { exact: true }).first().click(); await page.waitForTimeout(12000);
  const inputs = await page.$$eval('input, textarea', els => els.filter(e => e.offsetParent !== null).map(e => (e.placeholder || e.name || e.id) + '|' + e.type + '|' + (e.type === 'checkbox' ? e.checked : String(e.value).slice(0, 40))));
  const btns = await page.$$eval('button', els => els.filter(e => e.offsetParent !== null).map(e => (e.innerText || '').trim()).filter(x => x && x.length < 25));
  const t = (await page.innerText('body')).replace(/\s+/g, ' '); await page.screenshot({ path: 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/bugs/zoho-dept-marketing.png' });
  return { url: page.url(), inputs, btns: btns.slice(-12), text: t.slice(t.indexOf('Departments /'), t.indexOf('Departments /') + 1200) }; })
