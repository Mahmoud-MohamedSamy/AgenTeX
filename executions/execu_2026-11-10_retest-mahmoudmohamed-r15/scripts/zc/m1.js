const fs=require('fs');
module.exports = async ({ page, api, log, RUN }) => {
  await require('./nav.js').leads(page);
  const L = p => fs.appendFileSync(RUN+'/ledger-zoho-crm.md', `- ${new Date().toISOString()} ${p}\n`); const S={ids:[]};
  for (let b=0;b<2;b++){ const data=[...Array(100)].map((_,i)=>({ Last_Name:'QA RT15 2807 '+String(b*100+i+1).padStart(4,'0'), Company:'QA RT15 2807', Lead_Source:'Advertisement' }));
    const r = await api('POST','/crm/v8/Leads',{data}); const j=JSON.parse(r.body); const ok=(j.data||[]).filter(x=>x.status==='success'); S.ids.push(...ok.map(x=>x.details.id)); log('batch',b,r.status,ok.length); }
  L(`Leads "QA RT15 2807 0001–0200" ${S.ids.length} records (API), ids in out/zoho-2807.json`);
  const cv = await api('POST','/crm/v8/settings/custom_views?module=Leads',{custom_views:[{name:'QA RT15 2807 view',access_type:'only_to_me',fields:[{api_name:'Last_Name'},{api_name:'Lead_Source'},{api_name:'Company'}],criteria:{field:{api_name:'Company'},comparator:'equal',value:['QA RT15 2807']}}]});
  S.cv=JSON.parse(cv.body).custom_views?.[0]?.details?.id; log('cv',cv.status,S.cv); if(S.cv) L(`Leads custom view "QA RT15 2807 view" ${S.cv}`);
  fs.writeFileSync(RUN+'/out/zoho-2807.json', JSON.stringify(S));
};
