async (page) => {
  const c = page.getByText('Skip for now'); const n = await c.count(); let clicked = false;
  for (let i = n - 1; i >= 0; i--) { if (await c.nth(i).isVisible()) { await c.nth(i).click(); clicked = true; break; } }
  await page.waitForTimeout(8000);
  if (!/crm\.zoho\.com\/crm/.test(page.url())) { await page.goto('https://crm.zoho.com/crm/org944965048/tab/Leads', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(12000); }
  return { n, clicked, url: page.url().replace(/\?.*/, ''), t: (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 300) };
}
