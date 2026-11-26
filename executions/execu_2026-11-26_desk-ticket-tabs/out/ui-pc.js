const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const U = st.U;
const tab = async n => { await page.getByRole('tab', { name: new RegExp(n, 'i') }).first().click(); await sleep(2500); };
const body = async () => (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
const pane = async () => (await body()).replace(/^[\s\S]*?HISTORY/, '').slice(0, 500);
const dlg = async () => (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
// P-01 empty on loose ticket
await go('/views/all/tickets/' + U.x); await sleep(5000); await tab('Parent-Child'); out['P-01'] = await pane(); await shot('P01-empty');
// P-02 parent tab
await go('/views/all/tickets/' + U.u2); await sleep(5000); await tab('Parent-Child'); out['P-02 parent tab'] = await pane(); await shot('P02-parent');
// link loose ticket via dialog
const lk = page.getByRole('button', { name: /Link child tickets/i }); out.linkBtn = await lk.count();
if (out.linkBtn) { await lk.first().click(); await sleep(1500); out['P-02 dialog'] = await dlg();
  const s = page.locator('[role=dialog] input').first(); await s.fill(String(st.U.xn)); await sleep(2500); out['P-02 search by number'] = await dlg(); await shot('P02-search-number');
  await s.fill('QA TT UI loose'); await sleep(2500); out['P-02 search by subject'] = await dlg();
  const opt = page.locator('[role=dialog]').getByText(/QA TT UI loose/).first(); await opt.click().catch(() => {}); await sleep(800);
  await page.locator('[role=dialog]').getByRole('button', { name: /^Link$/ }).click().catch(() => {}); await sleep(3000);
  out['P-02 after link'] = await pane(); await shot('P02-after-link'); }
// P-03 child view
await go('/views/all/tickets/' + U.c1); await sleep(5000); await tab('Parent-Child'); out['P-03 child tab'] = await pane(); await shot('P03-child');
// P-06 unlink from parent on child
const ul = page.getByRole('button', { name: /Unlink from parent/i }); out.unlinkFromParent = await ul.count();
// P-10 close parent with block rule
await go('/views/all/tickets/' + U.u2); await sleep(5000);
const closeB = page.getByRole('button', { name: /^Close ticket/i }).first(); await closeB.click(); await sleep(1500); out['P-10 step1'] = await dlg(); await shot('P10-step1');
const confirm = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Close ticket$|^Close all$/i });
if (await confirm.count()) { await confirm.first().click(); await sleep(2500); }
out['P-10 step2'] = await dlg(); await shot('P10-step2');
const cancel = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Cancel$/ }); if (await cancel.count()) await cancel.click();
await sleep(1500); out['P-10 status after cancel'] = (await body()).match(/Status (\w[\w ]*?) Due/)?.[1];
// P-12 screen: status dropdown on parent (bypass check) - just read options; do not change
return out;
