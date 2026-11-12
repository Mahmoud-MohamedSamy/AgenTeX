async (page) => { const R = {};
  const t0 = await bodyText(); const i0 = t0.indexOf('Preview'); R.prevNoLayout = t0.slice(i0, i0 + 120);
  await page.locator('input[placeholder^="e.g."]').fill('QA LR1112 I1 dbl');
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'Choose a layout' }).click(); await sleep(800); await page.getByRole('option', { name: 'QA LR1112 Layout', exact: true }).click(); await sleep(1500);
  await page.locator('button[aria-haspopup=listbox]', { hasText: 'Choose the field' }).click(); await sleep(800); R.pfOpts = await page.getByRole('option').allInnerTexts(); await page.getByRole('option', { name: 'QA LR1112 vip', exact: true }).click(); await sleep(1500);
  const sw = page.getByRole('switch', { name: 'Active' }); if ((await sw.getAttribute('aria-checked')) === 'true') await sw.click(); await sleep(500);
  const t = await bodyText(); const i = t.indexOf('PRIMARY FIELD'); R.after = t.slice(i, i + 700); await shot('crm-I1-editor');
  R.btns = await page.evaluate(() => [...document.querySelector('main').querySelectorAll('button')].filter(e => e.getBoundingClientRect().height > 0).map(e => (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30)).slice(-25));
  return R; }
