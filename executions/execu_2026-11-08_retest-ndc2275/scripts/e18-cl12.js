module.exports=async()=>{const R={};const qs=['search=QA%20EM-01','q=QA%20EM-01','filter[subject][contains]=EM-01','ticket_number=2495'];
 for(const q of qs){const r=await api('GET','/modules/'+T+'/records?'+q+'&per_page=50');const L=arr(r.j&&r.j.data).map(fl);R[q]=r.s+' n='+L.length+' '+L.slice(0,6).map(o=>o.ticket_number+':'+String(o.subject).slice(0,40)+':'+String(o.created_at).slice(11,16)).join(' | ');}
 const p1=await api('GET','/modules/'+T+'/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc');const L=arr(p1.j&&p1.j.data).map(fl);R.page1=L.length+' first '+(L[0]&&L[0].ticket_number+' '+L[0].created_at)+' last '+(L[L.length-1]&&L[L.length-1].ticket_number+' '+L[L.length-1].created_at);R.meta=JSON.stringify(p1.j&&p1.j.meta).slice(0,300);
 return R;};
