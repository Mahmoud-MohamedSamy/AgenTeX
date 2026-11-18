const ids=[I.t2864a.t1.id,I.t2864a.t2.id];const out=[];
const d=(await api('GET','/notifications?limit=50&apps=desk')).j?.data;for(const x of (d?.data||[])){if(ids.includes(x.data?.record_id))out.push({at:x.created_at,type:x.event_type,title:x.title,keys:Object.keys(x),dk:Object.keys(x.data||{})});}
const p=(await api('GET','/notifications/preferences/me')).j?.data;const sig=(p?.signals||[]).filter(s=>/desk/.test(s.event_type||s.module)).map(s=>s.event_type+' email muted='+(s.channels||[]).find(c=>c.channel==='email')?.muted);
return {out,sig};
