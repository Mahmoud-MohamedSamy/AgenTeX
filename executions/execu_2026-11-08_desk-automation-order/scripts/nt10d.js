const S=JSON.parse(fs.readFileSync('../nt10r.json','utf8'));const r=await api('GET','/desk/tickets/'+S.ticket+'/replies');
const L=Array.isArray(r.j?.data)?r.j.data:(r.j?.data?.items||[]);const x=L.find(e=>/closed/.test(e.subject||''))||L[0];
const m=s=>String(s||'').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').replace(/(happiness\/)[A-Za-z0-9_-]+/g,'$1<tok>').replace(/(token=)[A-Za-z0-9_-]+/g,'$1<tok>');
return {keys:Object.keys(x||{}),status:x?.status||x?.delivery_status,sent:x?.sent_at,body_text:m(x?.body_text||x?.text).slice(0,500),body_html:m(x?.body_html||x?.html||x?.body).slice(0,900)};
