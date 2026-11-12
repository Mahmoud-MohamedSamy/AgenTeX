const { openEditor } = require('./lib-ed');
module.exports = async (h) => {
  const { page, shot, log } = h;
  await openEditor(h, 'QA AO WF D editor');
  const main = page.locator('main').last();
  const summary = async () => (await main.innerText()).split('\n').find(l => /This rule will be executed/.test(l));
  const openWhen = async () => { const bb = await main.getByRole('button', { name: 'Field Changed', exact: true }).first().boundingBox().catch(() => null); if (!bb || bb.height < 5) { await main.getByText(/This rule will be executed/).first().click(); await page.waitForTimeout(800); } };
  await openWhen(); const D1 = {};
  for (const b of ['Create', 'Edit', 'Create or Edit', 'Delete', 'Field Changed']) { await main.getByRole('button', { name: b, exact: true }).first().dispatchEvent('click'); await page.waitForTimeout(500); D1[b] = await summary(); }
  log('D1', D1);
  // D3 watch field list (Field Changed selected)
  const wtxt = (await main.innerText()).split('WHEN')[1].split('CONDITION')[0]; log('D3_panel', wtxt.slice(0, 600)); await shot('s7-fieldchanged');
  const sel = main.locator('button[role=combobox], [role=combobox], select').first();
  if (await sel.count()) { await sel.click(); await page.waitForTimeout(700); log('D3_watch', (await page.getByRole('option').allInnerTexts()).slice(0, 120)); await page.keyboard.press('Escape'); }
  // D2-ish: Done without watch field
  await main.getByRole('button', { name: 'Done' }).first().dispatchEvent('click'); await page.waitForTimeout(500); log('D2_doneNoField', (await main.innerText()).split('\n').filter(l => /pick|watch|field to/i.test(l)).slice(0, 4));
  // D4/D5 Date-Time
  await openWhen(); await main.getByText('A Date-Time field', { exact: true }).dispatchEvent('click'); await page.waitForTimeout(700);
  const dt = (await main.innerText()).split('WHEN')[1].split('CONDITION')[0]; log('D45_panel', dt.slice(0, 900)); await shot('s7-datetime');
  const combos = main.locator('[role=combobox], button[aria-haspopup=listbox], select');
  log('D5_comboCount', await combos.count());
  if (await combos.count()) { await combos.first().click(); await page.waitForTimeout(700); log('D5_dates', await page.getByRole('option').allInnerTexts()); await page.keyboard.press('Escape'); }
  await main.getByRole('button', { name: 'Done' }).first().dispatchEvent('click'); await page.waitForTimeout(500);
  log('D4_doneNoDate', (await main.innerText()).split('\n').filter(l => /pick|date field/i.test(l)).slice(0, 4));
  // D8 counting mode
  for (const t of ['Business hours', 'Elapsed time']) { const b = main.getByText(t, { exact: true }).first(); if (await b.count()) { await b.click(); await page.waitForTimeout(400); log('D8_' + t, (await main.innerText()).split('\n').filter(l => /business|elapsed|counting|This rule will be/i.test(l)).slice(0, 6)); } }
  // D11
  log('D11_scoreOffered', /score value/i.test(await main.innerText()));
  // D10 delete + remove tags
  await openWhen(); await main.getByText('A Record Action', { exact: true }).dispatchEvent('click').catch(() => {}); await page.waitForTimeout(400);
  await main.getByRole('button', { name: 'Delete', exact: true }).first().dispatchEvent('click'); await page.waitForTimeout(400);
  await main.getByRole('button', { name: 'Done' }).first().dispatchEvent('click').catch(() => {}); await page.waitForTimeout(400);
  log('D12_collapsed', (await main.innerText()).split('WHEN')[1].split('CONDITION')[0].trim().slice(0, 300));
  await main.getByRole('button', { name: 'Add action' }).first().dispatchEvent('click'); await page.waitForTimeout(500); await main.getByRole('button', { name: /^Remove Tags/ }).first().dispatchEvent('click'); await page.waitForTimeout(700);
  log('D10_removeTagsOnDelete', (await main.innerText()).split('\n').filter(l => /remove tags|can't|cannot|deleted record/i.test(l)).slice(0, 5)); await shot('s7-d10', { full: true });
};
