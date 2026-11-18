const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-18_zoho-import-owner/';
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
const setMap = async (row, name) => {
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800); await page.locator('input[data-id="dest_None_textBox"]:visible').first().click();
  await page.waitForTimeout(1500); await page.keyboard.type(name); await page.waitForTimeout(1500);
  const all = await page.locator('li:visible').all(); let n = 0;
  for (const l of all) { const t = (await l.innerText()).split('*').join('').trim(); if (t === name) { await l.click(); n = 1; break; } }
  await page.waitForTimeout(1500); return n; };
const cur = await page.$$eval('input', es => es.filter(e=>e.offsetParent && (e.getAttribute('data-id')||'').indexOf('dest_') === 0).map(e => e.value)); out.before = cur;
if (cur[1] === 'None') out.dep = await setMap(2, 'Department');
out.con = await setMap(4, 'Contact');
out.inp = await page.$$eval('input', es => es.filter(e=>e.offsetParent && (e.getAttribute('data-id')||'').indexOf('dest_') === 0).map(e => e.value));
await page.screenshot({ path: D + 'shots/12-A-mapped.png' });
