async (page) => {
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/details/1499272000000451185', { waitUntil: 'commit', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(14000);
  const nb = page.getByText('Not Now', { exact: true }); if (await nb.count()) await nb.first().click().catch(() => {});
  await page.screenshot({ path: '../evidence/zoho-tm/detail.png' });
  const btns = await page.locator('[data-title],[aria-label],[title]').evaluateAll(es => es.filter(e => { const r = e.getBoundingClientRect(); return r.y < 200 && r.x > 700 && r.width > 0; }).map(e => (e.getAttribute('data-title') || e.getAttribute('aria-label') || e.getAttribute('title')) + '@' + Math.round(e.getBoundingClientRect().x) + ',' + Math.round(e.getBoundingClientRect().y)));
  return { url: page.url().slice(-60), btns: [...new Set(btns)].slice(0, 40) };
}
