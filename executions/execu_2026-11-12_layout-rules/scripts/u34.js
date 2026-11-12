async (page) => { const R = {};
  const before = await page.locator('button[role=combobox]').count();
  const add = page.getByRole('button', { name: /Add row|Add criteria|\+ Row|Add condition row/i }); R.addBtns = await add.count();
  R.btnNames = (await page.getByRole('button').allInnerTexts()).filter(s => s.trim()).slice(0, 80).join(' | ');
  return R; }
