const S=JSON.parse(fs.readFileSync('../nt06e.json','utf8'));const j=(await api('GET','/desk/tickets/'+S.ticket+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
return L.map(e=>(e.occurred_at||'').slice(11,19)+' '+e.action+' '+JSON.stringify(e.summary||e.data||{}).replace(/[A-Za-z0-9._%+-]+@[A-Za-z]+\.[A-Za-z.]+/g,'<e>').slice(0,220));
