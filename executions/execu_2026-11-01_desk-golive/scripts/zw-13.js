async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  o.status = await page.locator('[data-id="status_textBox"]').inputValue().catch(() => '?');
  await page.locator('button', { hasText: /^Submit$/ }).last().click(); await sleep(10000);
  o.url = page.url(); o.toast = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Unable to process[^.]{0,60}|QA GL W2 zoho draft check.{0,80}/)?.[0];
  await page.screenshot({ path: S + 'z-ticket-created2.png' }); return o; }
