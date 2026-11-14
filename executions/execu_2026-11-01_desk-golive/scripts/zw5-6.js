async (page) => {
  await page.getByText('Priority', {exact:true}).last().click(); await page.waitForTimeout(1500);
  await page.screenshot({path:'evidence/zoho-w5/z-e1-priority.png'});
  return (await page.innerText('body')).match(/UPDATE FIELD[\s\S]{0,200}/)?.[0].replace(/\s+/g,' ');
}
