async (p0, frame, ctx) => { const page = ctx.pages()[ctx.pages().length - 1]; const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  await page.getByText('Data Sharing', { exact: true }).first().click(); await page.waitForTimeout(10000); o.url = page.url();
  let t = ''; for (const f of page.frames()) t += ' ' + (await f.innerText('body').catch(() => ''));
  o.body = t.replace(/\s+/g, ' ').match(/.{0,200}(Data Sharing|Private|Public).{0,1200}/)?.[0];
  await page.screenshot({ path: S + 'zi-datasharing.png' }); return o; }
