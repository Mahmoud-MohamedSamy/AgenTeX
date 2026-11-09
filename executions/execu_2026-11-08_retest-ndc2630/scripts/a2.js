const fs=require('fs');const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' '+m+'\n');
const tok=(await ctx.cookies()).find(x=>x.name==='aw_staging_access_token');
const C='https://staging-crm.taviportal.com/api/v1';const ca=async(m,p,b)=>{const r=await ctx.request.fetch(C+p,{method:m,headers:{authorization:'Bearer '+tok.value,'content-type':'application/json'},data:b?JSON.stringify(b):undefined,timeout:90000});const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{s:r.status(),j,t:t.slice(0,500)};};
const o={};
const mods=await ca('GET','/modules');const ML=arr(mods.j&&mods.j.data&&(mods.j.data.modules||mods.j.data));const lm=ML.find(m=>/^leads?$/i.test(m.apiName||m.api_name||m.name||m.moduleName||'')||/^leads?$/i.test((m.labels&&m.labels.en)||''));o.leadsModule=lm&&lm.id;if(!lm){o.keys=Object.keys(ML[0]||{});o.first=JSON.stringify(ML[0]).slice(0,300);return o;}
const F=await ca('GET','/modules/'+lm.id+'/fields');const FL=arr(F.j&&F.j.data&&(F.j.data.fields||F.j.data));o.required=FL.filter(f=>f.required).map(f=>f.apiName);
o.emailF=FL.filter(f=>/mail/i.test(f.apiName)).map(f=>f.apiName+'/'+f.datatypeKey);o.reqF=FL.filter(f=>f.required).map(f=>f.apiName+'/'+f.datatypeKey+'/'+(f.labels&&f.labels.en));const enc=v=>({kind:'string',value:v});const vals={first_name:'QA RT13 2630 lead',single_line_3_9:'QA RT13',email:'qa.rt13.2630@example.com'};const r=await ca('POST','/modules/'+lm.id+'/records',{data:Object.entries(vals).map(([field,v])=>({field,value:enc(v)}))});o.create=r.s+' '+(r.s>=300?r.t:'');const id=r.j&&r.j.data&&(r.j.data.id||(r.j.data.record&&r.j.data.record.id));o.lead=id;
if(id){LED('lead '+id+' "QA RT13 2630 lead" by owner');fs.writeFileSync('../out/lead.json',JSON.stringify({id,module:lm.id}));}
return o;
