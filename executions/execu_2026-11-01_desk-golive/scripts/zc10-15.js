async (page) => {
  await page.goto('https://desk.zoho.com/agent/techegysolutions/qa-c10-marketing/tickets/1499272000000451038/conversation',{waitUntil:'domcontentloaded'}).catch(()=>{});
  let t=''; for (let i=0;i<25;i++){ await page.waitForTimeout(1500); t=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' '); if (/QA C10 owned|not authorized|permission|doesn.t exist/i.test(t)) break; }
  await page.screenshot({path:'evidence/zoho-c10/ag2-in-dept-t101.png'});
  const api = await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'}; const r={};
    const g = async p => { const x = await fetch(B+p,{headers:H}); const t=await x.text(); try{const j=JSON.parse(t); if (j.data) return x.status+' '+j.data.map(d=>'#'+d.ticketNumber+' '+d.subject).join(' ; '); if (j.ticketNumber) return x.status+' #'+j.ticketNumber+' '+j.subject; }catch(e){} return x.status+' '+t.slice(0,150); };
    r.t101 = await g('tickets/1499272000000451038'); r.t102 = await g('tickets/1499272000000451083'); r.t100 = await g('tickets/1499272000000426244');
    r.t101dept = await g('tickets/1499272000000451038?departmentId=1499272000000446029');
    return r;
  });
  return {url:page.url(), ui:t.slice(0,600), api};
}
