async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.waitForTimeout(3000); o.body = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 1500);
  await page.screenshot({ path: S + 'zi-setup.png' }); return o; }
