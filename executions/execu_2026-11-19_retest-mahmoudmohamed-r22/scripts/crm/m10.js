const ids=JSON.parse(fs.readFileSync('../out/2807-bin.json','utf8')).slice(1);const o={trace:[]};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z CRM: '+m+'\n');
await sleep(5000);const r=await api('POST','/audit/recycle-bin/run-jobs?app_key=crm',{action:'purge',ids});o.start=r.s+' '+String(r.t).slice(0,140);const jid=r.j?.data?.id;LED('2807: recycle bin purge run '+jid+' for '+ids.length+' QA RT22 2807 leads');
const r2=await api('POST','/audit/recycle-bin/run-jobs?app_key=crm',{action:'purge',ids:ids.slice(0,1)});o.secondRun=r2.s+' '+String(r2.t).slice(0,200);
for(let i=0;i<16;i++){await sleep(20000);const g=(await api('GET','/audit/recycle-bin/run-jobs/'+jid)).j?.data;o.trace.push(new Date().toISOString().slice(11,19)+' '+g?.status+' '+g?.succeeded+'/'+g?.total+' failed '+g?.failed);if(/completed|failed|cancel/.test(g?.status))break;}
let it=[],c='';for(let i=0;i<8;i++){const q=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200'+(c?'&cursor='+c:''));it=it.concat(arr(q.j?.data?.items||q.j?.data));c=q.j?.meta?.next_cursor;if(!c)break;}
o.mineLeftInBin=it.filter(x=>/^QA RT22 2807/.test(x.record_label||'')).length;return o;
