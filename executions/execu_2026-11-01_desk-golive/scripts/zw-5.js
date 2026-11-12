async (page) => { const o = {}; const S = 'D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/executions/execu_2026-11-01_desk-golive/evidence/zoho-w2/';
  const sleep = ms => page.waitForTimeout(ms); const flat = async () => (await page.innerText('body')).replace(/\s+/g, ' ');
  const esc = async () => { await page.keyboard.press('Escape'); await sleep(1200); };
  await esc(); await page.locator('[data-title="Share Ticket"]').first().click().catch(() => {}); await sleep(1500);
  // Move dialog
  await page.locator('[data-title="More Actions (M)"]').first().click(); await sleep(2000);
  await page.locator('li', { hasText: /^Move/ }).first().click().catch(e => o.e1 = e.message.slice(0, 60)); await sleep(3500);
  o.move = ((await flat()).match(/Move (Ticket|to).{0,600}/i) || [''])[0]; await page.screenshot({ path: S + 'z-move-dialog.png' });
  const cancel = page.locator('button, [role=button]', { hasText: /^Cancel$/ }).last(); if (await cancel.count()) await cancel.click().catch(() => {}); else await esc(); await sleep(1500);
  // Approval tab
  await page.locator('text=/^APPROVAL$/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(3500);
  o.approvalTab = ((await flat()).match(/APPROVAL HISTORY.{0,300}/) || [''])[0]; await page.screenshot({ path: S + 'z-approval-tab.png' });
  return o; }
