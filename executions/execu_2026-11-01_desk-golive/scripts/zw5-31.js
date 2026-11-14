async (page) => {
  await page.locator('[aria-label="Setup"]').first().click(); await page.waitForTimeout(8000);
  const url=page.url(); const t=(await page.innerText('body')).replace(/\s+/g,' ');
  const i=t.search(/Product/i);
  return {url, around: i>=0? t.slice(Math.max(0,i-300), i+300):'none', head:t.slice(0,300)};
}
