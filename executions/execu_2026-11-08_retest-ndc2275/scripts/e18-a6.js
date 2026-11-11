module.exports=async()=>{const R={};const CMID='43004ce2-577f-4eda-b00a-0750fe40c3d4';const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@(?!help-staging)/g,'$1***@');
 const r=await api('GET','/modules/'+CMID+'/records?page=1&per_page=50&sort_by=created_time&sort_dir=desc');R.n=arr(r.j&&r.j.data).length;R.recent=arr(r.j&&r.j.data).map(fl).filter(o=>/help-staging|fldubai/.test(String(o.email))||String(o.created_time||'')>'2026-11-10T14:50').map(o=>({id:o.id,name:o.full_name||o.last_name,email:m(o.email),created:o.created_time}));
 return R;};
