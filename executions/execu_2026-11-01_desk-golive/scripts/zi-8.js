async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(12000);
  const np = page.locator('text=/^Not Now$/'); if (await np.count()) await np.first().click().catch(() => {});
  await page.getByText('#115', { exact: false }).first().click(); await page.waitForTimeout(9000);
  await page.keyboard.press('Shift+D'); await page.waitForTimeout(12000);
  o.panel = (await page.innerText('body')).replace(/\s+/g, ' ').match(/MOVE.{0,600}/i)?.[0];
  await page.screenshot({ path: S + 'zi-move.png' }); return o; }
