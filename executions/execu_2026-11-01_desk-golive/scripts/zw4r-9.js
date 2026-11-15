async (page) => {
  const out = {};
  await page.getByText('Reply All', { exact: true }).first().click(); await page.waitForTimeout(5000);
  await page.screenshot({ path: 'evidence/zoho-w4r/compose.png' });
  const body = (await page.innerText('body')).replace(/\s+/g, ' ');
  out.hasHappiness = /How would you rate|customer service\?|Happiness/i.test(body);
  const i = body.search(/How would you rate|Happiness/i); out.snip = i >= 0 ? body.slice(i - 100, i + 200) : '';
  return out;
}
