async (page) => {
  const R = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/zoho/';
  const out = {};
  await page.waitForTimeout(3000);
  await page.screenshot({ path: R + 'z27b.png' });
  const before = new Set((await page.innerText('body')).split('\n'));
  const lines = (await page.innerText('body')).split('\n');
  out.newLines = lines.filter(l => l.trim()).slice(0, 0);
  const pop = await page.evaluate(() => [...document.querySelectorAll('*')].filter(e => e.offsetParent && /lyte-drop-box|autocomplete|lookupList|suggest/i.test((e.className||'').toString()+e.tagName)).slice(0,5).map(e => e.tagName + '|' + (e.className||'').toString().slice(0,50) + '|' + e.innerText.slice(0, 200)));
  out.pop = pop;
  return out;
}
