async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.getByText('My Information', { exact: true }).first().click(); await page.waitForTimeout(10000); o.url = page.url();
  let t = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' '); const i = t.indexOf('Workstation'); o.body = t.slice(i, i + 1500);
  const sig = page.getByText(/Signature/i).first(); if (await sig.count()) { await sig.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(1500); }
  await page.screenshot({ path: S + 'zi-myinformation.png' }); return o; }
