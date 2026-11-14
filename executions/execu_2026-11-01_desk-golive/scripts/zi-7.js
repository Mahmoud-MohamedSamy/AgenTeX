async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const inp = page.locator('input[placeholder*="Search in Setup"]').first(); await inp.click(); await inp.fill('signature'); await page.waitForTimeout(4000);
  o.res = (await page.innerText('body')).replace(/\s+/g, ' ').match(/.{0,100}ignature.{0,400}/gi)?.slice(0, 4);
  await page.screenshot({ path: S + 'zi-setup-search-sig.png' }); return o; }
