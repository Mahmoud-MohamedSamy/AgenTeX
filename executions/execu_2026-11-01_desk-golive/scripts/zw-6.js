async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  await sleep(3000); o.move = ((await flat()).match(/MOVE.{0,300}/) || [''])[0]; await page.screenshot({ path: S + 'z-move-panel.png' });
  await page.keyboard.press('Escape'); await sleep(1500);
  // approval tab via data attribute
  const tabs = page.locator('text=APPROVAL'); o.apCount = await tabs.count(); if (o.apCount) await tabs.last().click({ force: true }).catch(e => o.e2 = e.message.slice(0, 60)); await sleep(4000);
  o.approval = ((await flat()).match(/(Request Approval|No approval|Approval).{0,300}/) || [''])[0]; await page.screenshot({ path: S + 'z-approval-tab.png' });
  return o; }
