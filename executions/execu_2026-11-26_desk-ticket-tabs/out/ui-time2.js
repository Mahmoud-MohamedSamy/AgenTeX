const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const U = st.U;
const tab = async n => { await page.getByRole('tab', { name: new RegExp(n, 'i') }).first().click(); await sleep(2500); };
const body = async () => (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
const pane = async () => (await body()).replace(/^[\s\S]*?HISTORY/, '').slice(0, 420);
const dlg = async () => (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400);
const timerTxt = async () => (await page.locator('header, [class*=header]').allInnerTexts().catch(() => [])).join(' ').match(/(\d+:\d\d:\d\d|Timer active on #\d+|AUTO)/g);
await go('/views/all/tickets/' + U.u1); await sleep(6000);
out.timerOnOpen = await timerTxt();
await tab('Time Entry');
// T-07 who dropdown
const who = page.getByRole('combobox').filter({ hasText: /All Time Entry/ }).or(page.getByRole('button', { name: /All Time Entry|Show time entries of/i }));
out.whoCtl = await who.count();
if (out.whoCtl) { await who.first().click(); await sleep(800); out.whoOptions = (await page.locator('[role=listbox], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.getByRole('option', { name: /My Time Entries/i }).or(page.getByRole('menuitem', { name: /My Time Entries/i })).first().click().catch(() => {}); await sleep(2000); out['T-07 mine'] = await pane(); await shot('T07-mine'); }
const flt = page.getByRole('combobox').filter({ hasText: /Total Time Spent/ }).or(page.getByRole('button', { name: /Total Time Spent/i }));
out.fltCtl = await flt.count();
if (out.fltCtl) { await flt.first().click(); await sleep(800); out.fltOptions = (await page.locator('[role=listbox], [role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); await page.getByRole('option', { name: /^Billable$/i }).or(page.getByRole('menuitem', { name: /^Billable$/i })).first().click().catch(() => {}); await sleep(2000); out['T-07 billable'] = await pane(); await shot('T07-billable'); }
// native selects fallback
const sel = page.locator('select'); out.selects = await sel.count();
// T-12: ensure a running timer on U1 then close
const startB = page.getByRole('button', { name: /^Start timer|^Resume timer/i }); if (await startB.count()) { await startB.first().click(); await sleep(4000); }
out.timerBeforeClose = await timerTxt();
const closeB = page.getByRole('button', { name: /^Close ticket/i }).first();
await closeB.click(); await sleep(1500); out['T-12 step1'] = await dlg();
const confirm = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Close ticket$/i });
if (await confirm.count()) { await confirm.click(); await sleep(2500); }
out['T-12 step2'] = await dlg(); await shot('T12-timer-dialog');
const cancel = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Cancel$/ });
if (/timer is still running/i.test(out['T-12 step2']) && await cancel.count()) { await cancel.click(); await sleep(2000); out['T-12 after cancel'] = { status: (await body()).match(/Status (\w[\w ]*?) Due/)?.[1], timer: await timerTxt() };
  await closeB.click(); await sleep(1500); if (await confirm.count()) { await confirm.click(); await sleep(2500); }
  const submit = page.locator('[role=dialog], [role=alertdialog]').last().getByRole('button', { name: /^Submit time$/i });
  if (await submit.count()) { await submit.click(); await sleep(2500); out['T-12 submit dialog'] = await dlg(); await shot('T12-submit');
    const s2 = page.locator('[role=dialog]').last().getByRole('button', { name: /^Submit$/ }); if (await s2.count()) { await s2.click(); await sleep(4000); } }
  out['T-12 after submit'] = { status: (await body()).match(/Status (\w[\w ]*?) Due/)?.[1], timer: await timerTxt(), tab: (await pane()).slice(0, 200) }; await shot('T12-after-submit');
}
return out;
