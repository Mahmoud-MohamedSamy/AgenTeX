async (page) => {
  return await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'}; const r={};
    const g = async p => { const x = await fetch(B+p,{headers:H}); const t=await x.text(); try{const j=JSON.parse(t); if (j.data) return x.status+' '+j.data.map(d=>'#'+d.ticketNumber+' '+d.subject).join(' ; '); if (j.ticketNumber) return x.status+' #'+j.ticketNumber+' '+j.subject; }catch(e){} return x.status+' '+t.slice(0,200); };
    r.t101 = await g('tickets/1499272000000451038'); r.t102 = await g('tickets/1499272000000451083');
    r.listMkt = await g('tickets?departmentId=1499272000000446029&limit=20');
    return r;
  });
}
