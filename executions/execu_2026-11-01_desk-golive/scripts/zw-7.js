async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  await page.getByText('Submit For Approval', { exact: false }).last().click({ force: true }).catch(e => o.e1 = e.message.slice(0, 60)); await sleep(4000);
  o.form = ((await flat()).match(/(Submit|Approval).{0,500}/g) || []).slice(-2); await page.screenshot({ path: S + 'z-approval-form.png' });
  // open the approver picker if any
  const ap = page.locator('text=/Approver|Select Approver|Choose/i').first(); o.apField = await ap.count(); if (o.apField) { await ap.click().catch(() => {}); await sleep(2500); o.apList = await page.$$eval('li', es => es.filter(e => e.offsetParent !== null).map(e => e.innerText.trim()).filter(t => t && t.length < 50).slice(0, 25)); await page.screenshot({ path: S + 'z-approval-approvers.png' }); }
  const cancel = page.locator('button, [role=button], span', { hasText: /^Cancel$/ }).last(); if (await cancel.count()) await cancel.click().catch(() => {}); await sleep(1500); await page.keyboard.press('Escape'); await sleep(1000);
  return o; }
