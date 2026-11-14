async (page) => { const o = {}; const S = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms);
  await page.mouse.click(640, 242); await sleep(3000);
  o.opts = await page.$$eval('li, [role=option]', es => [...new Set(es.filter(e => e.offsetParent !== null).map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(t => t && t.length < 80))].slice(0, 30));
  await page.screenshot({ path: S + 'z-approval-approvers.png' });
  await page.keyboard.press('Escape'); await sleep(800);
  await page.getByText('Cancel', { exact: true }).last().click({ force: true }).catch(e => o.ce = e.message.slice(0, 50)); await sleep(2000);
  o.after = (await page.innerText('body')).replace(/\s+/g, ' ').match(/Approvals available.{0,60}|Select Approver.{0,40}/)?.[0];
  return o; }
