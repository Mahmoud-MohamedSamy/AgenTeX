const st = JSON.parse(require('fs').readFileSync(require('path').join(process.cwd(), 'out/state.json'), 'utf8'));
const out = {}; const U = st.U;
const tab = async n => { await page.getByRole('tab', { name: n }).first().click(); await sleep(3000); };
const body = async () => (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
// P-07 hidden child note
await go('/views/all/tickets/' + st.P.P); await sleep(6000);
await tab(/Parent-Child|الأصل/i); out['P-07'] = (await body()).replace(/^[\s\S]*?HISTORY/, '').slice(0, 500); await shot('P07-C-hidden');
// C on time entry tab of U2 + menu on owner's entry (U1 is closed now; use U2 which has none) -> check U1 anyway
await go('/views/all/tickets/' + st.T.t1); await sleep(6000); await tab(/Time Entry/i); out['T-16 C tab'] = (await body()).replace(/^[\s\S]*?HISTORY/, '').slice(0, 400);
const acts = page.getByRole('button', { name: /Time entry actions/i }); out.actionMenus = await acts.count();
if (out.actionMenus) { await acts.first().click(); await sleep(800); out['T-16 C menu on first row'] = (await page.locator('[role=menu]').innerText().catch(() => '')).replace(/\s+/g, ' '); await shot('T16-C-menu'); await page.keyboard.press('Escape'); }
// TT-02 Arabic: switch language from header, check three tabs, switch back
const lang = page.getByRole('button', { name: /^EN/ }).first();
await lang.click(); await sleep(1000); const ar = page.getByRole('menuitem', { name: /العربية|Arabic/i }).or(page.getByRole('option', { name: /العربية|Arabic/i }));
out.arOption = await ar.count();
if (out.arOption) { await ar.first().click(); await sleep(6000);
  out.dir = await page.evaluate(() => document.documentElement.dir || document.body.dir);
  const tabs = await page.getByRole('tab').allInnerTexts(); out['TT-02 tabs'] = tabs.join(' | ');
  for (let i = 0; i < tabs.length; i++) { if (i === 0) continue; }
  const pick = async re => { const t = page.getByRole('tab').filter({ hasText: re }); if (await t.count()) { await t.first().click(); await sleep(3000); return (await body()).slice(-700); } return 'tab not found'; };
  out['AR time'] = await pick(/الوقت|وقت/); await shot('TT02-ar-time');
  out['AR resolution'] = await pick(/الحل/); await shot('TT02-ar-resolution');
  out['AR parent'] = await pick(/الأصل|الفرعية|أصل/); await shot('TT02-ar-parent');
  out.rawKeys = ((await body()).match(/\b[a-z]+(\.[a-zA-Z_]+){2,}\b/g) || []).slice(0, 10);
  // switch back
  const back = page.getByRole('button', { name: /^AR|^ع/ }).first(); await back.click().catch(() => {}); await sleep(1000);
  await page.getByRole('menuitem', { name: /English/i }).or(page.getByRole('option', { name: /English/i })).first().click().catch(() => {}); await sleep(4000);
  out.backToEn = await page.evaluate(() => document.documentElement.lang + '/' + (document.documentElement.dir || 'ltr'));
}
return out;
