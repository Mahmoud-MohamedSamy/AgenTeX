async (page) => {
  const res={};
  for (const u of ['products/list/all','products']) {
    await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/'+u,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
    res[u]=[page.url(), (await page.innerText('body')).slice(0,400).replace(/\s+/g,' ')];
    if (!/cannot be found/.test(res[u][1])) break;
  }
  await page.screenshot({path:'evidence/zoho-w5/z-p-list.png'});
  return res;
}
