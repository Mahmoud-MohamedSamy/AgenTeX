const R={};
const x=await api('GET','/modules/'+TK+'/records?limit=20&q='+encodeURIComponent('QA RT19 NTF 3000'));R.s=x.s;
const L=Ls(x.j?.data);const f=r=>{const o={id:r.id};for(const d of (r.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
R.found=L.map(f).map(o=>[o.ticket_number,o.subject,o.channel,o.status,o.department===D?'D':o.department,o.created_at||'',o.id].join(' | '));
return R;
