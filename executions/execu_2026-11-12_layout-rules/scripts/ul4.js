async (page) => { const R = {}; const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3', rid = 'fdbcd8f8-c6dd-45ff-9d51-89c1764c9a6b';
  await openRec(mid, rid); await page.getByRole('button', { name: /^Edit$/ }).first().click(); await sleep(5000); R.lowSees = await page.getByText('Suggested: 42').count(); await shot('crm-F14-low');
  // X4 as CRM User: deal create on QA Deals layout, amount editable?
  const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', dl = 'ca63559f-2adf-4253-9b8d-8f227d96b078';
  await openCreate(dm, dl); R.dealFields = await page.locator('[data-rule-field]').count();
  if (R.dealFields) { await wrap('stage').locator('button[role=combobox]').first().click(); await sleep(700); await page.getByRole('option', { name: /negotiation/i }).first().click(); await sleep(800); await typeIn('discount', '30');
    R.amount = await page.evaluate(() => { const w = document.querySelector('[data-rule-field=amount]'); if (!w) return 'none'; const i = w.querySelector('input'); return { lock: !!w.querySelector('svg[class*=lock]'), ro: !!(i && (i.readOnly || i.disabled)) }; }); R.noteReq = await isReq('qa_lr_appnote'); await wrap('amount').scrollIntoViewIfNeeded().catch(() => {}); await shot('crm-X4-low', false); }
  else R.body = (await bodyText()).slice(0, 200);
  return R; }
