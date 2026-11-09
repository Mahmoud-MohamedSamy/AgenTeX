async (page) => { const o = {}; const D = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/raw/m17/';
  await page.mouse.click(1545, 95); await page.waitForTimeout(800);
  await page.mouse.click(740, 217); await page.waitForTimeout(2000);
  o.t = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Layout.{0,120}/)?.[0];
  await page.screenshot({ path: D + 'zoho-acc-layout-picker.png' }); await page.keyboard.press('Escape'); return o; }
