const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const s=v=>({kind:'string',value:v});const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
const ids=[];for(let b=0;b<10;b++){const rs=await Promise.all([...Array(20)].map((_,i)=>{const n=String(b*20+i+1).padStart(4,'0');return api('POST','/modules/'+L+'/records',{data:[{field:'first_name',value:s('QA RT22')},{field:'last_name',value:s('2807 '+n)}]});}));for(const r of rs)if(r.j?.data?.id)ids.push(r.j.data.id);}
o.created=ids.length;fs.writeFileSync('../out/2807.json',JSON.stringify({L,ids}));LED('2807: '+ids.length+' leads "QA RT22 2807 nnnn" (ids in out/2807.json)');
const t0=Date.now();const c=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:ids.slice(0,20),data:[{field:'lead_source',value:s('Web')}]});o.control=c.s+' '+String(c.t).slice(0,200)+' in '+(Date.now()-t0)+'ms';
return o;
