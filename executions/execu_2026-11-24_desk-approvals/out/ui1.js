const R17 = '4247038a-4c9e-4260-b90d-bc8ee8261905', R16 = '32735622-1479-4312-96e8-da585b21e3a4', R2 = 'd36056c5-caf6-441a-9101-be30f56050ad';
const tid = s => page.locator(`[data-testid="${s}"]`);
const o = {};
await go('/approvals'); await sleep(4000);
o.url = page.url();
await shot('ui1-B-page');
o.navCount = await tid('desk-nav-approvals-count').first().innerText().catch(() => 'none');
o.pageText = (await tid('approvals-page').innerText().catch(() => text())).slice(0, 2500);
o.rows = await page.locator('[data-testid^="approval-row-"]').count();
o.overdueTile = await tid('approvals-overdue-tile').count();
// open R17 row
const row = tid('approval-row-' + R17);
o.r17visible = await row.count();
if (o.r17visible) { await row.first().click(); await sleep(2500); o.detail = (await tid('approval-detail').innerText().catch(() => '')).slice(0, 1500); await shot('ui1-B-detail-R17'); }
// reject dialog validation on R17
const acts = tid('approval-detail');
if (await acts.count()) {
  const rej = acts.getByRole('button', { name: /reject/i }).first();
  if (await rej.count()) {
    await rej.click(); await sleep(1500);
    const dlg = page.getByRole('dialog').last(); o.rejectDialog = (await dlg.innerText().catch(() => '')).slice(0, 600);
    const ta = dlg.locator('textarea').first(); const save = dlg.getByRole('button', { name: /^reject/i }).last();
    o.saveDisabledEmpty = await save.isDisabled().catch(() => 'n/a');
    await ta.fill('ab'); await sleep(400); o.saveDisabledTwo = await save.isDisabled().catch(() => 'n/a'); o.msgTwo = (await dlg.innerText()).slice(0, 400);
    await ta.fill('    '); await sleep(400); o.saveDisabledSpaces = await save.isDisabled().catch(() => 'n/a');
    await ta.fill('QA PA UI reject reason'); await sleep(400); o.saveDisabledOk = await save.isDisabled().catch(() => 'n/a');
    await shot('ui1-B-reject-dialog');
    await save.click(); await sleep(3000); o.afterReject = (await text()).match(/Rejected[^\n]{0,80}/)?.[0] || 'no toast';
    await shot('ui1-B-after-reject');
  } else o.rejectBtn = 'not found: ' + (await acts.innerText());
}
// deep link
await go('/approvals?item=' + R16); await sleep(3500);
o.deepLink = (await tid('approval-detail').innerText().catch(() => 'no detail')).slice(0, 300);
await shot('ui1-B-deeplink');
// no-match empty state
await go('/approvals?q=zzzz-no-match-qa'); await sleep(3500);
o.noMatch = (await tid('approvals-page').innerText().catch(() => '')).slice(0, 600);
// team approver display (R2)
await go('/approvals?item=' + R2); await sleep(3500); o.teamDetail = (await tid('approval-detail').innerText().catch(() => '')).slice(0, 800);
// phone width
await page.setViewportSize({ width: 400, height: 860 }); await go('/approvals'); await sleep(3500);
o.phoneScrollX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
await shot('ui1-B-phone');
return o;
