async (page, ctx, h) => {
  await page.goto('https://crm.zoho.com/crm/org944965048/settings/modules', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  const links = await page.$$eval('a', as => as.map(a => a.getAttribute('href')).filter(x => x && /Leads|validation/i.test(x)).slice(0, 20));
  await page.getByText('Leads', { exact: true }).first().click().catch(e=>0);
  await page.waitForTimeout(4000);
  return { url: page.url(), links, txt: (await page.innerText('body')).slice(0, 800) };
}
