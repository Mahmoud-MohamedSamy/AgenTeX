const o = { steps: [] }; const tid = s => page.locator(`[data-testid="${s}"]`);
const A1 = '5097dd52-22d6-4fc1-b2ea-821796fb167e', A2 = 'ee7bbf5c-926a-5e66-ae48-5d4372395256', A3 = '2dfb4c8b-3baa-4480-b830-f21bb74ecd28';
await go('/approvals'); await sleep(5000);
// bell
const bell = page.locator('header button').filter({ has: page.locator('svg') }).filter({ hasText: /\d|\+/ }).first();
if (await bell.count()) { await bell.click(); await sleep(3000); o.bell = ((await text()).match(/.{0,120}K7 arabic.{0,60}/) || [null])[0]; await shot('ui13-B-bell-ar'); await page.keyboard.press('Escape'); await sleep(800); }
// keyboard: Tab from the top of the page to a target button, then Enter
const tabTo = async (pred, max = 120) => { for (let i = 1; i <= max; i++) { await page.keyboard.press('Tab'); const hit = await page.evaluate(pred); if (hit) return i; } return -1; };
const focusInDialog = () => page.evaluate(() => !!document.activeElement && !!document.activeElement.closest('[role=dialog]'));
const run = async (aid, verb, reason) => {
  await go('/approvals'); await sleep(4000); await page.mouse.click(5, 5).catch(() => {});
  const pred = new Function(`const a=document.activeElement; const box=a&&a.closest('[data-testid="approval-actions-${aid}"]'); return !!box && /${verb === 'approve' ? 'approve|موافق' : 'reject|رفض'}/i.test((a.getAttribute('aria-label')||'')+' '+a.innerText);`);
  const tabs = await tabTo(pred); const s = { aid: aid.slice(0, 8), verb, tabs };
  if (tabs < 0) { o.steps.push(s); return; }
  s.label = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
  await page.keyboard.press('Enter'); await sleep(1500);
  s.dialogOpen = await page.getByRole('dialog').count(); s.focusInDialog = await focusInDialog();
  if (reason) { await page.keyboard.type(reason); await sleep(300); }
  s.dialogText = (await page.getByRole('dialog').last().innerText().catch(() => '')).slice(0, 300);
  // Tab to the confirm button (last primary) and press Enter
  let ok = false; for (let i = 0; i < 15; i++) { const t = await page.evaluate(() => { const a = document.activeElement; return a && a.tagName === 'BUTTON' && a.closest('[role=dialog]') ? a.innerText.trim() : ''; }); if (/^(موافقة|رفض|Approve|Reject)/.test(t) && !/إلغاء|Cancel/.test(t)) { ok = true; s.confirm = t; break; } await page.keyboard.press('Tab'); }
  if (ok) { await page.keyboard.press('Enter'); await sleep(4000); }
  s.dialogClosed = (await page.getByRole('dialog').count()) === 0;
  s.after = await page.evaluate(() => document.activeElement && (document.activeElement.getAttribute('aria-label') || document.activeElement.tagName));
  s.toast = ((await text()).match(/(تمت الموافقة|تم الرفض|Approved|Rejected)[^\n]{0,60}/) || [null])[0];
  o.steps.push(s); await shot('ui13-B-kb-' + verb + '-' + aid.slice(0, 4));
};
await run(A1, 'approve');
await run(A2, 'approve');
await run(A3, 'reject', 'سبب الرفض: ينقص إيصال الدفع');
return o;
