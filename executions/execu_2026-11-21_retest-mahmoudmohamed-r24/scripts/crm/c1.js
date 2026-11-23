const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
const s=v=>({kind:'string',value:v});const E=r=>r.s+' '+(r.s>=300?String(r.j?.error?.message||r.t).slice(0,220)+' '+JSON.stringify(r.j?.error?.details||'').slice(0,200):'');
const cur=async()=>arr((await api('GET','/currencies')).j?.data).map(c=>({id:c.id,code:c.code,rate:c.exchange_rate,home:c.is_home||c.is_base||c.home,active:c.is_active}));
const prof=(await api('GET','/iam/tenant/company-profile')).j?.data;o.companyCurrency=prof?.currency;o.currencies=await cur();
const fl=arr((await api('GET','/modules/'+D+'/fields')).j?.data);const cf=fl.find(f=>f.apiName==='currency'||f.fieldName==='currency');o.currencyFieldType=cf?.datatypeKey;o.currencyOptions=JSON.stringify(cf?.datatypeOptions||cf?.config||'').slice(0,300);
// 3109
o.addXYZ=E(await api('POST','/currencies',{code:'XYZ',symbol:'X',exchange_rate:2,is_active:true}));
const j=await api('POST','/currencies',{code:'JPY',symbol:'¥',exchange_rate:0.123456789012,is_active:true});o.addJPY12dp=E(j);if(j.j?.data?.id){LED('currency JPY '+j.j.data.id);o.jpyStoredRate=(await cur()).find(c=>c.code==='JPY')?.rate;}
// 3106
let eur=(await cur()).find(c=>c.code==='EUR');if(!eur){const r=await api('POST','/currencies',{code:'EUR',symbol:'€',exchange_rate:50,is_active:true});o.addEUR=E(r);if(r.j?.data?.id)LED('currency EUR '+r.j.data.id);eur=(await cur()).find(c=>c.code==='EUR');}
const fl2=arr((await api('GET','/modules/'+D+'/fields')).j?.data).find(f=>f.apiName==='currency'||f.fieldName==='currency');o.currencyOptionsAfterEUR=JSON.stringify(fl2?.datatypeOptions||'').slice(0,300);
const dr=await api('POST','/modules/'+D+'/records',{data:[{field:'deal_name',value:s('QA RT22 CRM 3106 Deal EUR')},{field:'currency',value:s('EUR')},{field:'amount',value:{kind:'number',value:1000}}]});o.dealEUR=E(dr);const did=dr.j?.data?.id;
if(did){LED('deal QA RT22 CRM 3106 Deal EUR '+did);const g=(await api('GET','/modules/'+D+'/records/'+did)).j?.data;o.dealStored=(g?.data||[]).filter(x=>/currency|amount|exchange|home/i.test(x.field)).map(x=>x.field+'='+JSON.stringify(x.value?.value)).join(' ');}
// 3108
if(eur){o.deleteUsedEUR=E(await api('DELETE','/currencies/'+eur.id));o.eurAfter=!!(await cur()).find(c=>c.code==='EUR');}
fs.writeFileSync('../out/crm-c1.json',JSON.stringify({o,did,eur:eur?.id,jpy:j.j?.data?.id},null,1));return o;
