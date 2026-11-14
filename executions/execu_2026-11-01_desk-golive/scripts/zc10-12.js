async (page) => {
  for (let i=0;i<40;i++){ try{ await page.waitForTimeout(1500); if (/All Tickets|Tickets/.test(await page.innerText('body')) && (await page.innerText('body')).length>300) break;}catch(e){} }
  const nn = page.locator('text=/^Not Now$/'); if (await nn.count()) await nn.first().click().catch(()=>{});
  await page.waitForTimeout(4000);
  await page.screenshot({path:'evidence/zoho-c10/ag2-list.png'});
  const ui = (await page.innerText('body')).replace(/\s+/g,' ').slice(0,900);
  const api = await page.evaluate(async () => {
    const B='/supportapi/zd/techegysolutions/api/v1/'; const csrf=(document.cookie.match(/crmcsr=([^;]+)/)||[])[1];
    const H={'X-ZCSRF-TOKEN':'crmcsrfparam='+csrf, orgId:'946801013'}; const r={};
    const g = async p => { const x = await fetch(B+p,{headers:H}); const t=await x.text(); return x.status+' '+t.slice(0,350); };
    r.me = await g('myinfo'); r.depts = await g('myDepartments?isEnabled=true');
    r.t101 = await g('tickets/1499272000000451038'); r.t102 = await g('tickets/1499272000000451083');
    r.listMkt = await g('tickets?departmentId=1499272000000446029&limit=20');
    r.listAll = await g('tickets?limit=20');
    r.search = await g('tickets/search?subject=QA%20C10*&limit=20');
    return r;
  });
  return {url:page.url(), ui, api};
}
