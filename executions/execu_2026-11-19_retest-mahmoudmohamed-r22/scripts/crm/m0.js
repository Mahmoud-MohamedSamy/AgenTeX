const ms=arr((await api('GET','/modules')).j?.data);const L=ms.find(m=>/^leads$/i.test(m.apiName||m.api_name||m.name||m.pluralLabel||''))||ms.find(m=>/lead/i.test(JSON.stringify(m).slice(0,200)));
const lid=L?.id;const s=v=>({kind:'string',value:v});const ids=[];
for(let i=1;i<=2;i++){const r=await api('POST','/modules/'+lid+'/records',{data:[{field:'last_name',value:s('QA RT22 2807 probe '+i)}]});ids.push(r.j?.data?.id||r.s+' '+r.t.slice(0,150));}
const tries=[{ids,data:[{field:'lead_source',value:s('Web')}]},{record_ids:ids,data:[{field:'lead_source',value:s('Web')}]},{record_ids:ids,fields:{lead_source:'Web'}}];const out=[];
for(const b of tries){const r=await api('POST','/modules/'+lid+'/records/mass-update',b);out.push(r.s+' '+String(r.t).slice(0,250));if(r.s<300)break;}
return {lid,name:L?.name||L?.apiName,ids,out};
