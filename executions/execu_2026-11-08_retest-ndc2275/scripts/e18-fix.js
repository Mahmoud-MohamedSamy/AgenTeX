module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';
 const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:{kind:'string',value:v}}))});
 for(const v of ['2026-10-12T12:43:13.2306828+00:00','2026-10-12T12:43:13Z']){const p=await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:v}));const a=fl((await api('GET','/modules/'+T+'/records/'+T1)).j.data);R['try '+v]=p.s+' -> '+a.closed_time+' '+(p.s>=300?p.t.slice(0,150):'');if(String(a.closed_time).startsWith('2026-10-12'))break;}
 const d=(await api('GET','/desk/tickets/'+T1)).j.data;R.deskClosedAt=d.closed_at;R.status=d.status;
 const ids=new Set(['86c1ae73-d57c-47f5-ba1a-79d0d69b8368','bcb0dc3a-bcd3-4fd9-9307-631cc541f822']);const items=[];let cur='';
 for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j.data))if(ids.has(x.record_id))items.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur||items.length===2)break;}
 R.binFound=items.length;if(items.length){R.binPurge=(await api('POST','/audit/recycle-bin/delete',{ids:items})).s;LED('recycle bin E18 controls '+items.length+' '+R.binPurge);}
 return R;};
