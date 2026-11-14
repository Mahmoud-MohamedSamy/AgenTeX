async (page) => {
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/general/departments',{waitUntil:'commit',timeout:60000}).catch(()=>{});
  let t=''; for (let i=0;i<25;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' '); if (/QA C10 Marketing/.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/departments.png'});
  const i=t.indexOf('Departments'); return {url:page.url(), t:t.slice(t.lastIndexOf('Departments'), t.lastIndexOf('Departments')+800)};
}
