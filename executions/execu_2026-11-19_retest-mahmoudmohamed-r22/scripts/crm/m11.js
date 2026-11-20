const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const s=v=>({kind:'string',value:v});const ids=[];
for(let b=0;b<3;b++){const rs=await Promise.all([...Array(20)].map((_,i)=>api('POST','/modules/'+L+'/records',{data:[{field:'first_name',value:s('QA RT22')},{field:'last_name',value:s('2807 b '+(b*20+i+1))}]})));for(const r of rs)if(r.j?.data?.id)ids.push(r.j.data.id);}
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: 2807: 60 leads QA RT22 2807 b (out/2807b.json)\n');fs.writeFileSync('../out/2807b.json',JSON.stringify(ids));
const j=await api('POST','/modules/'+L+'/records/mass-update-jobs',{record_ids:ids,data:[{field:'lead_source',value:s('Web')}]});return {n:ids.length,job:j.s+' '+String(j.t).slice(0,120)};
