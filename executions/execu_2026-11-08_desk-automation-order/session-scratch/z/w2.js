async (page, frame) => {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(9000);
  const links = await page.$$eval('a[href]', as => as.map(a => a.innerText.trim() + ' => ' + a.getAttribute('href')).filter(s => /workflow|automation|rule/i.test(s)));
  return { url: page.url(), links: links.slice(0, 30) };
}
