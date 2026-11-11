const bin=await api('GET','/audit/recycle-bin/items?search=QA%20GS1111&limit=50'); const bi=arr(bin.j&&bin.j.data); const k0=bi[0]?Object.keys(bi[0]):[];
const gsItems=bi.filter(x=>/global/i.test(JSON.stringify(x)));
RES('H8', gsItems.length?'Pass':'Info', 'recycle bin search "QA GS1111": '+bi.length+' items, keys '+k0.slice(0,8)+'; global-set items '+gsItems.length+' '+JSON.stringify(gsItems[0]||bi[0]||'').slice(0,250));
const ev=await api('GET','/audit/events?entity_type=global_set&from=2026-11-11T00:00:00Z&limit=100'); const es=arr(ev.j&&ev.j.data); const mine=es.filter(e=>/QA GS1111/.test(JSON.stringify(e)));
fs.writeFileSync(RUN+'/out/audit-events.json',JSON.stringify(mine.slice(0,80),null,1));
const acts={}; mine.forEach(e=>{const k=(e.action||e.eventType||e.event_type); acts[k]=(acts[k]||0)+1;});
RES('L8', mine.length?'Info':'Fail', SR(ev)+' total '+es.length+', ours '+mine.length+': '+JSON.stringify(acts));
return mine.slice(0,2);
