let it=[],c='';for(let i=0;i<8;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=crm&limit=200'+(c?'&cursor='+c:''));it=it.concat(arr(r.j?.data?.items||r.j?.data));c=r.j?.meta?.next_cursor;if(!c)break;}
const mine=it.filter(x=>/^QA RT22 2807/.test(x.record_label||''));const o={binTotal:it.length,mine:mine.length,keys:Object.keys(mine[0]||{}).join(',')};
const tries=[{action:'purge',ids:mine.slice(0,1).map(x=>x.id)},{operation:'delete',ids:mine.slice(0,1).map(x=>x.id)},{ids:mine.slice(0,1).map(x=>x.id)}];o.tries=[];
for(const b of tries){const r=await api('POST','/audit/recycle-bin/run-jobs?app_key=crm',b);o.tries.push(JSON.stringify(b).slice(0,40)+' → '+r.s+' '+String(r.t).slice(0,220));if(r.s<300)break;}
fs.writeFileSync('../out/2807-bin.json',JSON.stringify(mine.map(x=>x.id)));return o;
