const tid = s => page.locator(`[data-testid="${s}"]`); const o = {};
await go('/approvals'); await sleep(4000);
o.tabs = (await page.locator('[role=tablist], nav').filter({ hasText: 'Waiting for me' }).first().innerText().catch(() => '')).slice(0, 200);
o.top = (await tid('approvals-page').innerText()).slice(0, 400);
// All pending list
const ap = page.getByText(/^All pending/).first(); if (await ap.count()) { await ap.click(); await sleep(3000); }
o.allPendingUrl = page.url(); o.allPendingTop = (await tid('approvals-page').innerText()).slice(0, 600);
await shot('ui4-O-all-pending');
// department scope
const dep = tid('approvals-department'); o.deptCtl = await dep.count();
if (await dep.count()) { await dep.first().click(); await sleep(800); const opt = page.getByRole('option', { name: 'QA PA Dept 2' }).first(); if (await opt.count()) { await opt.click(); } else { await page.getByText('QA PA Dept 2', { exact: true }).first().click().catch(() => {}); } await sleep(3000); o.dept2Top = (await tid('approvals-page').innerText()).slice(0, 700); o.dept2Url = page.url(); await shot('ui4-O-dept2'); }
// overdue tile filter
await go('/approvals?list=all_pending'); await sleep(3500);
const ot = tid('approvals-overdue-tile'); if (await ot.count()) { await ot.first().click(); await sleep(3000); o.overdueUrl = page.url(); o.overdueRows = await page.locator('[data-testid^="approval-row-"]').count(); await ot.first().click(); await sleep(2500); o.overdueCleared = page.url(); }
// web form item detail
await go('/approvals?list=all_pending&source=web_form&q=K1%20form'); await sleep(3500);
const wr = page.locator('[data-testid^="approval-row-"]').first(); if (await wr.count()) { await wr.click(); await sleep(2500); o.wfDetail = (await tid('approval-detail').innerText().catch(() => '')).slice(0, 1500); await shot('ui4-O-webform-detail');
  const ab = tid('approval-detail').getByRole('button', { name: /approve/i }).first(); o.wfButtons = (await tid('approval-detail').getByRole('button').allInnerTexts()).join(' | ');
  if (await ab.count()) { await ab.click(); await sleep(1500); o.wfApproveDialog = (await page.getByRole('dialog').last().innerText().catch(() => '')).slice(0, 700); await shot('ui4-O-webform-approve-dialog'); await page.keyboard.press('Escape'); await sleep(800); }
  const sb = tid('approval-detail').getByRole('button', { name: /spam/i }).first();
  if (await sb.count()) { await sb.click(); await sleep(1500); o.wfSpamDialog = (await page.getByRole('dialog').last().innerText().catch(() => '')).slice(0, 500); await page.keyboard.press('Escape'); await sleep(800); }
}
// blueprint item detail (bp 3, team D)
await go('/approvals?list=all_pending&source=blueprint'); await sleep(3500);
o.bpRows = await page.locator('[data-testid^="approval-row-"]').count();
const br = page.locator('[data-testid^="approval-row-"]').first(); if (await br.count()) { await br.click(); await sleep(2500); o.bpDetail = (await tid('approval-detail').innerText().catch(() => '')).slice(0, 1200); await shot('ui4-O-blueprint-detail'); }
// on-behalf dialog on a manual item (do not submit)
await go('/approvals?list=all_pending&source=manual&q=R16'); await sleep(3500);
const mr = page.locator('[data-testid^="approval-row-"]').first(); if (await mr.count()) { await mr.click(); await sleep(2500); o.manualDetailO = (await tid('approval-detail').innerText().catch(() => '')).slice(0, 900);
  const btns = await tid('approval-detail').getByRole('button').allInnerTexts(); o.ownerButtons = btns.join(' | ');
  const ob = tid('approval-detail').getByRole('button', { name: /behalf|approve/i }).first(); if (await ob.count()) { await ob.click(); await sleep(1500); o.onBehalfDialog = (await page.getByRole('dialog').last().innerText().catch(() => '')).slice(0, 600); await shot('ui4-O-on-behalf'); await page.keyboard.press('Escape'); } }
// settings page
await go('/settings/tickets/approvals'); await sleep(3500); o.settings = (await text()).match(/Approval[\s\S]{0,700}/)?.[0]; await shot('ui4-O-settings');
return o;
