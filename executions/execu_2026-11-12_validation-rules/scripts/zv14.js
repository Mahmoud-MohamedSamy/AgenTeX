async (page, ctx, h) => {
  const links = await page.$$eval('a', as => as.map(a => (a.innerText||'').trim()+' => '+a.getAttribute('href')).filter(x => /Leads|Validation|modules/i.test(x)).slice(0, 30));
  return { url: page.url(), links, txt: (await page.innerText('body')).slice(0, 600) };
}
