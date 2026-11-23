const ids=fs.readFileSync('../out/rules.txt','utf8').trim().split(/\s+/);const o=[];
for(const id of ids){const g=await api('GET','/workflow/rules/'+id);let d=null;if(g.s===200){d=(await api('DELETE','/workflow/rules/'+id)).s;}o.push([id.slice(0,8),g.j?.data?.name,g.s,d,(await api('GET','/workflow/rules/'+id)).s]);}
await sleep(2000);let cur='',ids2=[];for(let i=0;i<10;i++){const b=await api('GET','/audit/recycle-bin/items?app_key=workflow&app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(b.j?.data))if(/QA RT25 /.test(x.record_label||''))ids2.push(x.id);cur=b.j?.meta?.next_cursor;if(!cur)break;}
const p=ids2.length?(await api('POST','/audit/recycle-bin/delete',{ids:ids2})).s:null;return {o,bin:ids2.length,purge:p};
