async (page) => {
  await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000535091',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
  const t = await page.innerText('body');
  return {url: page.url(), pri: (t.match(/Priority[\s\S]{0,40}/)||[''])[0].replace(/\s+/g,' '), head: t.slice(0,400).replace(/\s+/g,' ')};
}
