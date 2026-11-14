async (page) => {
  const lab = page.getByText('Priority',{exact:true}).first(); await lab.scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
  await page.screenshot({path:'evidence/zoho-w5/z-e1-t115-pri.png'});
  return await lab.evaluate(e=>{let p=e; for(let k=0;k<4;k++)p=p.parentElement; return p.innerHTML.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,300) + ' || inputs: ' + [...p.querySelectorAll('input')].map(i=>i.value).join(',');});
}
