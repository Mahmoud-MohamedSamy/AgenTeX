async (page) => { const R = {}; const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', lid = 'ca63559f-2adf-4253-9b8d-8f227d96b078';
  await openCreate(dm, lid); await wrap('stage').locator('button[role=combobox]').first().click(); await sleep(700); await page.getByRole('option', { name: /negotiation/i }).first().click(); await sleep(800); await typeIn('discount', '30');
  R.amount = await page.evaluate(() => { const w = document.querySelector('[data-rule-field=amount]'); if (!w) return 'no amount'; const i = w.querySelector('input'); return { lock: !!w.querySelector('svg[class*=lock]'), ro: i && (i.readOnly || i.disabled), html: w.innerHTML.slice(0, 200) }; });
  await wrap('amount').scrollIntoViewIfNeeded(); await shot('crm-X4-amount', false); return R; }
