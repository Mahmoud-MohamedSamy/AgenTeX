// Cleanup of A2/A4: delete the 2 test tickets, their contacts only if created by this run (after 14:54 UTC today), purge from Recycle Bin.
module.exports=async()=>{const R={};const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4';const TK=['1223e44e-d4d6-45a2-a3fd-ada911cef2eb','7293be1e-a1ec-478e-9bc7-bb1adf2ee24e'];
 const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');const ids=[];const contacts=[];
 for(const id of TK){const o=fl(((await api('GET','/modules/'+T+'/records/'+id)).j||{}).data||{});const c=o.contact&&(o.contact.id||o.contact)||o.contact_id;
  if(c){const co=fl(((await api('GET','/modules/'+CMID+'/records/'+c)).j||{}).data||{});R['contact_'+id.slice(0,8)]={id:c,email:m(co.email),created:co.created_time||co.created_at};if(String(co.created_time||co.created_at||'')>'2026-11-10T14:54')contacts.push(c);}
  const d=await api('DELETE','/modules/'+T+'/records/'+id);R['del_'+id.slice(0,8)]=d.s;ids.push(id);LED('CL A5 delete ticket '+id+' '+d.s);}
 for(const c of contacts){const d=await api('DELETE','/modules/'+CMID+'/records/'+c);R['delc_'+c.slice(0,8)]=d.s;ids.push(c);LED('CL A5 delete contact '+c+' '+d.s);}
 await W(5000);const found=[];let cur='';for(let i=0;i<15;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&app_key=crm&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j&&r.j.data))if(ids.includes(x.record_id))found.push(x.id);cur=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cur)break;}
 R.binFound=found.length;if(found.length){const p=await api('POST','/audit/recycle-bin/delete',{ids:found});R.purge=p.s;LED('CL A5 recycle bin purge '+found.length+' '+p.s);}
 R.after=arr(((await api('GET','/modules/'+T+'/records?q=TAVI2TAVI&per_page=20')).j||{}).data).length+arr(((await api('GET','/modules/'+T+'/records?q=QA%20EM09&per_page=20')).j||{}).data).length;
 return R;};
