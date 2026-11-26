const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const U = st.U;
const tab = async n => { await page.getByRole('tab', { name: new RegExp(n, 'i') }).first().click(); await sleep(2500); };
const body = async () => (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
const pane = async () => (await body()).replace(/^[\s\S]*?HISTORY/, '').slice(0, 600);
const dlg = async () => (await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500);
const hdr = async () => (await page.locator('main').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
// T-01 / T-07 on U1 (has 2 entries)
await go('/views/all/tickets/' + U.u1); await sleep(5000);
out.header = await hdr();
await tab('Time Entry'); out['T-07 all'] = await pane(); await shot('T07-all');
for (const f of ['My Time Entries', 'Non Billable', 'Billable']) {
  const b = page.getByRole('button', { name: new RegExp('^' + f, 'i') }).or(page.getByText(new RegExp('^' + f + '$', 'i')));
  if (await b.count()) { await b.first().click().catch(() => {}); await sleep(1500); out['T-07 ' + f] = (await pane()).slice(0, 300); }
  else out['T-07 ' + f] = 'control not found';
}
await shot('T07-filtered');
// T-01 form
const addB = page.getByRole('button', { name: /Add Time Entry/i }); out.addBtn = await addB.count();
if (out.addBtn) { await addB.first().click(); await sleep(1500); out['T-01 form'] = await dlg(); await shot('T01-form');
  // T-05 screen: submit empty
  await page.getByRole('button', { name: /^Submit$/ }).last().click(); await sleep(1200); out['T-05 empty submit'] = await dlg(); await shot('T05-empty-submit');
  // fill 0h20 billable
  const num = page.locator('[role=dialog] input[type=number]'); out.numInputs = await num.count();
  const lbl = async (re, v) => { const i = page.getByLabel(re); if (await i.count()) { await i.first().fill(String(v)); return true; } return false; };
  out.filledMin = await lbl(/^Minutes/i, 20); await lbl(/^Hours/i, 0);
  const bt = page.getByLabel(/Billing Type/i); if (await bt.count()) { await bt.first().click().catch(() => {}); await sleep(600); await page.getByRole('option', { name: /^Billable$/ }).first().click().catch(() => {}); }
  await page.getByLabel(/Description/i).first().fill('QA TT added on screen').catch(() => {});
  await shot('T02-filled');
  await page.getByRole('button', { name: /^Submit$/ }).last().click(); await sleep(3000);
  out['T-02 after'] = await pane(); out['T-02 dialogLeft'] = await dlg(); await shot('T02-after');
}
// T-09 timer controls in header
out['T-09 header'] = await hdr();
const btns = await page.locator('main button[aria-label], main button[title]').evaluateAll(b => b.map(x => x.getAttribute('aria-label') || x.getAttribute('title')).filter(Boolean));
out.headerButtons = btns.filter(x => /timer|time/i.test(x));
const click = async re => { const b = page.getByRole('button', { name: re }); if (await b.count()) { await b.first().click(); await sleep(1500); return true; } return false; };
out.pause = await click(/^Pause timer/i); await sleep(2500); out.afterPause = await hdr();
out.resume = await click(/^Resume timer/i); await sleep(3000);
out.stop = await click(/^Stop timer/i); out['T-09 stop dialog'] = await dlg(); await shot('T09-stop-dialog');
const sub = page.getByRole('button', { name: /^Submit/i }); if (await sub.count()) { await sub.last().click(); await sleep(3000); }
out['T-09 after'] = (await pane()).slice(0, 300); await shot('T09-after');
// T-13 reload keeps timer (start again)
out.start = await click(/^Start timer/i); await sleep(5000); const t1 = (await hdr()).match(/\d:\d\d:\d\d/);
await page.reload({ waitUntil: 'domcontentloaded' }); await sleep(8000); const t2 = (await hdr()).match(/\d:\d\d:\d\d/);
out['T-13 before/after reload'] = [t1 && t1[0], t2 && t2[0]]; await shot('T13-after-reload');
// T-11 open another ticket
await go('/views/all/tickets/' + U.x); await sleep(6000); out['T-11 other ticket header'] = await hdr(); await shot('T11-other-ticket');
// T-12 back to U1, click Close ticket while running
await go('/views/all/tickets/' + U.u1); await sleep(6000);
const closeB = page.getByRole('button', { name: /^Close ticket/i }).or(page.getByText(/^Close ticket$/i));
if (await closeB.count()) { await closeB.first().click(); await sleep(2000); out['T-12 dialog'] = await dlg(); await shot('T12-close-dialog');
  const cancel = page.getByRole('button', { name: /^Cancel$/ }); if (await cancel.count()) { await cancel.last().click(); await sleep(1500); }
  out['T-12 after cancel'] = await hdr();
  await closeB.first().click(); await sleep(2000); const disc = page.getByRole('button', { name: /^Discard$/ }); if (await disc.count()) { await disc.last().click(); await sleep(3000); }
  out['T-12 after discard'] = await hdr(); await shot('T12-after-discard');
} else out['T-12'] = 'close button not found';
return out;
