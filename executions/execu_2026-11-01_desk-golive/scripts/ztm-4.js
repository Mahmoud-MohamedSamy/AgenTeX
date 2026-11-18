async (page) => {
  await page.locator('[data-title="More Actions (M)"]').first().click(); await page.waitForTimeout(2000);
  await page.screenshot({ path: '../evidence/zoho-tm/more-menu.png' });
  const items = await page.locator('li,[role=menuitem]').evaluateAll(es => es.filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.x > 1100 && r.y > 60 && r.y < 900; }).map(e => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean));
  return { items: [...new Set(items)] };
}
