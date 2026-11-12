const clk = l => l.dispatchEvent('click');
module.exports = (page) => {
  const main = page.locator('main').last();
  const choose = async (btn, label) => { await btn.click({ force: true }); await page.waitForTimeout(500); await page.locator(`xpath=//*[@role='option'][starts-with(normalize-space(.),"${label}")]`).first().click(); await page.waitForTimeout(500); };
  return {
    main, clk, choose,
    openConditions: async () => {
      await clk(main.getByText(/No conditions — actions run/).first()); await page.waitForTimeout(800);
      await clk(main.getByText('Tickets matching certain conditions', { exact: true }).first()); await page.waitForTimeout(800);
    },
    setCond: async (i, field, op, value) => {
      await choose(main.locator('button[aria-label="— select field —"]').nth(i), field);
      if (op) await choose(main.getByRole('button', { name: 'Operator' }).nth(i), op);
      if (value !== undefined) {
        const rows = main.locator('button[aria-label="Remove condition"]');
        const row = rows.nth(i).locator('xpath=..');
        const inp = row.locator('input, textarea').first();
        if (await inp.count()) { await inp.fill(value); } else { const chip = row.getByRole('button', { name: value, exact: true }).first(); if (await chip.count()) await clk(chip); }
        await page.waitForTimeout(300);
      }
    },
    condText: async () => ((await main.innerText()).split('CONDITION')[1] || '').split('Instant actions')[0],
  };
};
