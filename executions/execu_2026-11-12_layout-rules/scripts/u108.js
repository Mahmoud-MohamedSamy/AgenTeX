async (page) => { const R = {}; await page.keyboard.press('Escape'); await sleep(300);
  const sb = page.locator('main').getByText('Stage', { exact: true }).first().locator('xpath=ancestor::div[1]/following-sibling::*[1]//button | ancestor::div[2]//button').first(); R.n = await sb.count(); R.sbText = await sb.innerText().catch(() => '');
  await sb.click(); await sleep(800); R.opts = (await page.getByRole('option').allInnerTexts()).slice(0, 6); return R; }
