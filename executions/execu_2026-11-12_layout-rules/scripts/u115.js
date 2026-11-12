async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', rid = 'fdbcd8f8-c6dd-45ff-9d51-89c1764c9a6b';
  const edit = async () => { await openRec(mid, rid); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000); };
  await edit(); await pick('qa_lr_filter', 'X'); R.first = await page.getByText('Suggested: 42').count();
  await page.getByRole('button', { name: /^Ignore$/ }).first().click(); await sleep(800); R.afterIgnore = await page.getByText('Suggested: 42').count();
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3500); if (await page.getByText('Verify these values').count()) { await page.getByRole('button', { name: /^Continue$/ }).click(); await sleep(3500); } R.saved = (await errs()).join('|');
  await edit(); R.reopenOwner = await page.getByText('Suggested: 42').count(); await shot('crm-F14-owner'); return R; }
