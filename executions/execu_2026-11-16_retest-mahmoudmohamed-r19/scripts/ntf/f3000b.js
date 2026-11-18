const R={};const f=r=>{const o={id:r.id};for(const d of (r.data||[])){const v=d.value||{};o[d.field]=v.value;}return o;};
for(const q of ['ack tes','3000 ack','QA RT19 NTF']){const x=await api('GET','/modules/'+TK+'/records?limit=30&q='+encodeURIComponent(q));R[q]=Ls(x.j?.data).map(f).filter(o=>!/QA RT19 NTF (2864|3053|2851|3061)|QA BP RT19/.test(o.subject||'')).map(o=>[o.ticket_number,o.subject,o.channel,o.department===D?'D':String(o.department).slice(0,8),o.id.slice(0,8)].join(' | '));}
const m=await api('GET','/mail/messages?direction=inbound&limit=10');R.mail=m.s+' '+MASK(m.t).slice(0,600);
const s=await api('GET','/desk/channels/quarantine?limit=10');R.quar=s.s+' '+MASK(s.t).slice(0,600);
return R;
