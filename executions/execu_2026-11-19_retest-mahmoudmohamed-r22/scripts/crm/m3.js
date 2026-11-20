const T=JSON.parse(fs.readFileSync('../out/2807.json','utf8'));const L=T.L;const ids=T.ids.slice(20,22);const o={};const s=v=>({kind:'string',value:v});
o.mine=String((await api('GET','/mass-update-jobs/mine')).t).slice(0,300);
const tries=[{module_id:L,record_ids:ids,data:[{field:'lead_source',value:s('Chat')}]},{moduleId:L,recordIds:ids,data:[{field:'lead_source',value:s('Chat')}]},{module_id:L,record_ids:ids,fields:{lead_source:'Chat'}}];o.tries=[];
for(const b of tries){const r=await api('POST','/mass-update-jobs',b);o.tries.push(r.s+' '+String(r.t).slice(0,250));if(r.s<300)break;}
return o;
