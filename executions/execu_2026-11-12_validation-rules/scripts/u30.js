async (page) => { const R0 = {}; try { return await (async () => {
  // K2 (HTML shown as text), N3 (list with 60+ rules), B1 (empty state), D26 (date operators in the editor). ctx via globalThis.__IDS
  const A = globalThis.__APP; const X = globalThis.__IDS; const R = {}; globalThis.__R = R;
  page.__dialogs = [];
  const go = async (mid) => { const t0 = Date.now(); await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=validation', { waitUntil: 'domcontentloaded' }); await page.getByText(/QA VR1112|No validation rules/).first().waitFor({ timeout: 30000 }).catch(() => {}); return Date.now() - t0; };
  R.N3_loadMs = await go(X.mid); await sleep(2500);
  R.N3_rows = await page.locator('tbody tr, [role=row]').count();
  // K2 checks on the list
  R.K2_injectedImg = await page.locator('img[src="x"], img[src="y"]').count();
  R.K2_rowText = ((await bodyText()).match(/QA VR1112 K2.{0,80}/) || [''])[0];
  R.K2_boldTag = await page.locator('b:has-text("bold")').count();
  await shot(A + '-K2-list', false);
  // N3 filter
  const s = page.getByPlaceholder(/search rules/i).first(); const t1 = Date.now(); await s.fill('N3 59'); await page.getByText('QA VR1112 N3 59').first().waitFor({ timeout: 10000 }).catch(() => {}); R.N3_filterMs = Date.now() - t1; await sleep(500);
  R.N3_rowsAfterFilter = await page.locator('tbody tr').count(); await s.fill('K2'); await sleep(1500);
  // K2 editor
  await page.locator('tbody tr').filter({ hasText: 'K2' }).first().getByRole('button').first().click().catch(() => {}); await sleep(2500);
  const d = page.locator('[role=dialog]').last();
  if (await d.count()) { R.K2_editorName = await d.locator('input[type=text]').first().inputValue().catch(() => ''); R.K2_editorImg = await d.locator('img[src="x"], img[src="y"]').count(); R.K2_editorMsg = ((await d.innerText()).match(/QA K2.{0,60}/) || [''])[0]; await shot(A + '-K2-editor', false); await d.getByRole('button', { name: 'Cancel', exact: true }).first().click().catch(() => {}); await sleep(800); }
  R.K2_dialogs = page.__dialogs.slice();
  // D26 date operators
  await s.fill(''); await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
  const dd = page.locator('[role=dialog]').last(); const btn = l => dd.getByRole('button', { name: l, exact: true }).first();
  await btn('Layout').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 Layout' }).first().click(); await sleep(900);
  await btn('Field to check').click(); await sleep(700); await page.getByRole('option').filter({ hasText: 'QA VR1112 date' }).first().click(); await sleep(1200);
  if (!/Condition 1/.test(await dd.innerText())) { await btn('Add condition').click().catch(() => {}); await sleep(800); }
  const opBtn = dd.locator('button[role=combobox]').filter({ hasText: /is empty|is |before|after|equal/i }).last();
  await opBtn.click().catch(() => {}); await sleep(800); R.D26_ops = (await page.getByRole('option').allInnerTexts()).map(x => x.trim()); await shot(A + '-D26-date-ops', false); await page.getByRole('option').filter({ hasText: /before|less|earlier/i }).first().click().catch(() => {}); await sleep(800); R.D26_afterPick = (await dd.innerText().catch(() => '')).replace(/s+/g, ' ').match(/Condition 1.{0,200}/)?.[0];
  R.D26_valueInputs = await dd.evaluate(x => [...x.querySelectorAll('input')].map(i => i.type + ':' + (i.placeholder || '')).filter(t => !/^text:$/.test(t)).slice(0, 12), null, { timeout: 5000 }).catch(() => "no dialog");
  
  // close the editor (Escape closes it)
  await page.keyboard.press('Escape'); await sleep(800);
  // B1 empty state
  if (X.empty) { await go(X.empty); await sleep(2000); R.B1 = ((await bodyText()).match(/Validation Rules.{0,400}/) || [''])[0].slice(0, 400); await shot(A + '-B1-empty', false); }
  return R;
})(); } catch (e) { return { err: String(e.message).slice(0, 200), partial: globalThis.__R }; }
}