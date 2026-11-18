async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  const mid = async () => { const t = await page.innerText('body'); const i = t.lastIndexOf('Euro - EUR'); return t.slice(i).slice(0, 1500); };
  await page.mouse.click(1170, 160); await page.waitForTimeout(2500);
  await page.screenshot({ path: R + 'z30-edit-form.png' }); out.edit = await mid();
  return out;
}
