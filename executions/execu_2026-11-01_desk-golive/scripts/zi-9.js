async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.keyboard.press('Escape'); await page.waitForTimeout(800);
  await page.getByText('Webform test · urgent · 2026-10-13 08:37:42').first().click(); await page.waitForTimeout(10000); o.url = page.url();
  await page.mouse.click(1517, 80); await page.waitForTimeout(2500); await page.getByText('Move', { exact: true }).first().click().catch(e => o.e = String(e).slice(0, 80)); await page.waitForTimeout(15000);
  o.panel = (await page.innerText('body')).replace(/\s+/g, ' ').match(/MOVE.{0,700}/)?.[0];
  await page.screenshot({ path: S + 'zi-move.png' }); return o; }
