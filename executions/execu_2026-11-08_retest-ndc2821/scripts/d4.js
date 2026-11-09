const fs=require('fs');const o={};const TK=['c673c1e1-11d2-4d0d-ba3f-2316a25ed798','4bad326c-d2c8-4b72-b71b-50c413858bcf','8446d046-c298-4733-8e10-dd35840eedd4','749be659-b8d6-4578-a460-d24c04a390b0','20fa2b15-1be7-4be0-a3e4-0b7c07cd3304','89a507f8-c2ed-422f-8d83-c93a91da715e','7190bde1-b65b-41e9-8cad-f368edb16682'];
const list=async()=>{const all=[];let cur='';for(let i=0;i<10;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+cur:''));const L=(r.j&&r.j.data)||[];all.push(...L);cur=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}return all;};
const a=await list();const mine=a.filter(i=>TK.includes(i.record_id));o.found=mine.map(i=>i.module_key+' / '+i.record_label);o.total=a.length;
if(mine.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:mine.map(i=>i.id)});o.purge=p.s+' '+p.t.slice(0,140);await sleep(3000);const b=await list();o.leftMine=b.filter(i=>TK.includes(i.record_id)).length;o.totalAfter=b.length;}
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' CLEANUP recycle bin: purged '+mine.length+' own items by record id; left '+o.leftMine+'\n');
return o;
