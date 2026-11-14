async (page) => {
  for (let i=0;i<40;i++){ try{ await page.waitForTimeout(1000); if ((await page.innerText('body')).length>500) break;}catch(e){} }
  return page.url().slice(0,150) + ' :: ' + (await page.innerText('body')).slice(0,400).replace(/\s+/g,' ');
}
