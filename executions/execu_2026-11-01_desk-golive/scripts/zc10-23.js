async (page) => {
  await page.getByText('QA C10 Marketing',{exact:true}).first().click(); await page.waitForTimeout(5000);
  const t=(await page.innerText('body')).replace(/\s+/g,' ');
  await page.screenshot({path:'evidence/zoho-c10/dept-open.png'});
  const del = await page.getByText(/^Delete( Department)?$/).count();
  return {url:page.url(), del, t:t.slice(t.indexOf('QA C10'), t.indexOf('QA C10')+500)};
}
