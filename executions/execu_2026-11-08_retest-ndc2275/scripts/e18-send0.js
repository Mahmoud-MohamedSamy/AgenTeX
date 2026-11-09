module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';
 const mask=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@');
 for(const p of ['/desk/channels/sending-overview','/desk/channels/from-addresses','/desk/channels/addresses?department_id=2a73bbc0-efb3-4250-bf9b-2fdc98236794']){const r=await api('GET',p);R[p]=r.s+' '+mask(r.t.slice(0,700));}
 const d=(await api('GET','/desk/tickets/'+T1)).j.data;R.t1={status:d.status,dept:d.department_id,cc:d.cc_enabled,counts:d.counts};
 const comp=await api('GET','/desk/tickets/'+T1+'/reply-context');R.replyContext=comp.s+' '+mask(comp.t.slice(0,300));
 return R;};
