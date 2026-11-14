async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(12000);
  const np = page.locator('text=/^Not Now$/'); if (await np.count()) await np.first().click().catch(() => {});
  await page.mouse.click(1461, 24); await page.waitForTimeout(8000); o.url = page.url();
  o.body = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 2500);
  await page.screenshot({ path: S + 'zi-setup.png' }); return o; }
