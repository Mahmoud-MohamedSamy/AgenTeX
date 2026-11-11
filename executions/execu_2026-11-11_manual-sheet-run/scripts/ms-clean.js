// Delete + purge tickets whose subject starts with "QA MAN " (except names in KEEP), and templates "QA MAN template". node ms.js clean
module.exports=async()=>{const R={del:[],purged:0};const KEEP=(process.env.KEEP||'').split('|').filter(Boolean);
 let ids=[];for(let p=1;p<6;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&per_page=100&q='+encodeURIComponent('QA MAN'));const l=arr(r.j&&r.j.data).map(fl);ids.push(...l.filter(o=>String(o.subject).startsWith('QA MAN')&&!KEEP.includes(o.subject)));if(l.length<100)break;}
 for(const o of ids){const d=await api('DELETE','/modules/'+T+'/records/'+o.id);R.del.push(o.ticket_number+' '+d.s);LED('clean ticket "'+String(o.subject).slice(0,40)+'" '+o.id+' '+d.s);}
 if(process.env.TPL){const t=((await api('GET','/desk/ticket-templates')).j.data.templates||[]).filter(x=>x.name.startsWith('QA MAN'));for(const x of t){const d=await api('DELETE','/desk/ticket-templates/'+x.id);R.del.push('tpl '+x.name+' '+d.s);LED('clean template '+x.id+' '+d.s);}}
 await W(3000);let cur=null,bin=[];for(let i=0;i<20;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));const it=arr(r.j&&r.j.data);bin.push(...it);cur=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}
 const ids2=bin.filter(x=>String(x.record_label||'').startsWith('QA MAN')&&!KEEP.includes(x.record_label)).map(x=>x.id);
 for(let i=0;i<ids2.length;i+=25){const p=await api('POST','/audit/recycle-bin/delete',{ids:ids2.slice(i,i+25)});if(p.s<300)R.purged+=ids2.slice(i,i+25).length;}
 LED('clean purged '+R.purged+' from bin');return R;};
