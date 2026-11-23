const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CON='43004ce2-577f-4eda-b00a-0750fe40c3d4';const M=JSON.parse(fs.readFileSync('../out/2799-made2.json','utf8'));const o={t:{},bp:{},c:{},bin:[]};
const purge=async()=>{let items=[],cur='';for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&app_key=iam&app_key=workflow&app_key=mail&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));items=items.concat(arr(r.j?.data));cur=r.j?.meta?.next_cursor;if(!cur)break;}
 const ids=items.filter(x=>/^QA RT25B BP|^#?62(5[2-8])\b/.test(x.record_label||'')||Object.values(M.t).some(t=>t.id===x.record_id)||[M.c1].includes(x.record_id)||Object.values(M.bp).some(b=>b.id===x.record_id)).map(x=>x.id);
 for(let i=0;i<ids.length;i+=25)o.bin.push((await api('POST','/audit/recycle-bin/delete',{ids:ids.slice(i,i+25)})).s+':'+ids.slice(i,i+25).length);return ids.length;};
for(const [k,t] of Object.entries(M.t))o.t[k]=(await api('DELETE','/modules/'+TK+'/records/'+t.id)).s;
for(const k of ['c1'])o.c[k]=(await api('DELETE','/modules/'+CON+'/records/'+M[k])).s;
o.purge1=await purge();
for(const [k,b] of Object.entries(M.bp)){const r=await api('DELETE','/modules/'+TK+'/blueprints/'+b.id);o.bp[k]=r.s+(r.s>=300?' '+r.t.slice(0,150):'');}
await sleep(3000);o.purge2=await purge();
o.verify={t:await Promise.all(Object.values(M.t).map(async t=>(await api('GET','/modules/'+TK+'/records/'+t.id)).s)),bp:await Promise.all(Object.values(M.bp).map(async b=>(await api('GET','/modules/'+TK+'/blueprints/'+b.id)).s)),c:await Promise.all([M.c1].map(async c=>(await api('GET','/modules/'+CON+'/records/'+c)).s))};
o.purge3=await purge();
return o;
