async (page) => { const R = {}; await page.keyboard.press('Escape');
  R.btns = (await page.getByRole('button').allInnerTexts()).map(s => s.trim()).filter(Boolean).slice(-40);
  R.labels = await page.evaluate(() => [...document.querySelectorAll('button[aria-label],a[aria-label]')].map(b => b.getAttribute('aria-label')).slice(-40));
  return R; }
