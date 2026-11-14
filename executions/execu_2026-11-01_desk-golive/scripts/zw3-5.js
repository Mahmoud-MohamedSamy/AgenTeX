async (page) => {
  const r = {};
  for (const p of ['setup/profiles','setup/usersandcontrol/profiles','setup/ticketsettings','setup/customfunctions','setup/supportplans','setup/workflowrules']) {
    await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/'+p,{waitUntil:'domcontentloaded'}).catch(()=>{});
    let t=''; for (let i=0;i<15;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' '); if (t.length>400 && !/Loading/i.test(t.slice(0,200))) break; }
    r[p] = page.url().replace('https://desk.zoho.com/agent/techsolutionsegypt/tech/','') + ' :: ' + t.replace(/Your free trial.*?Purchase a license/,'').slice(0,300);
  }
  return r;
}
