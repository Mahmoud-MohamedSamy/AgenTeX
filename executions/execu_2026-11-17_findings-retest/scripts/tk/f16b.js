const safe=s=>String(s).replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g,'<addr>');const N='8c6073ac-ba5f-4d17-9960-71a6850662a9';
const r=await api('GET','/desk/notification-rules/departments/'+N);log('rules raw',r.s,safe(r.t.slice(0,200)));const j=r.j?.data;const all=Array.isArray(j)?j:(j?.rules||j?.items||Object.values(j||{}).flat());log(all.filter(x=>x&&/contact\./.test(x.key||'')).map(x=>x.key+' en='+x.is_enabled).join(' ; '));
const l=await api('GET','/modules/'+TK+'/records?limit=100&sort=-created_at');const rows=arr(l.j?.data);log('list',l.s,rows.length);
const pick=rows.map(x=>{const o={};for(const f of (x.data||[]))o[f.field]=f.value?.value;return {n:o.ticket_number,ch:o.channel,c:x.created_at,s:safe(String(o.subject).slice(0,40))};}).filter(x=>/email/i.test(String(x.ch)));log(JSON.stringify(pick.slice(0,10)));
log('first created',rows[0]?.created_at,'last',rows[rows.length-1]?.created_at);
