async (page) => {
  const out={};
  // reload so the session drops the department
  await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/tickets/list/all-cases',{waitUntil:'domcontentloaded'});
  for (let i=0;i<20;i++){ await page.waitForTimeout(1500); if (/#100/.test(await page.innerText('body').catch(()=>''))) break; }
  await page.waitForTimeout(3000);
  out.list = (await page.innerText('body')).replace(/\s+/g,' ').match(/All Tickets.{0,300}/)?.[0];
  await page.screenshot({path:'evidence/zoho-c10/ag2-out-list.png'});
  for (const [k,d] of [['t101','qa-c10-marketing'],['t101b','techegysolutions']]) {
    await page.goto('https://desk.zoho.com/agent/techegysolutions/'+d+'/tickets/details/1499272000000451038',{waitUntil:'commit',timeout:60000}).catch(()=>{});
    let t=''; for (let i=0;i<20;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' '); if (/QA C10 owned|authori|permission|cannot be found|not have/i.test(t)) break; }
    out[k]=t.slice(0,300); await page.screenshot({path:'evidence/zoho-c10/ag2-out-'+k+'.png'});
  }
  out.api = await page.evaluate(async () => { const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'}; const r={};
    for (const [k,p] of [['t101','tickets/1499272000000451038'],['t102','tickets/1499272000000451083'],['mkt','tickets?departmentId=1499272000000446029&limit=20']]) { const x=await fetch(B+p,{headers:H}); r[k]=x.status+' '+(await x.text()).slice(0,100); } return r; });
  return out;
}
