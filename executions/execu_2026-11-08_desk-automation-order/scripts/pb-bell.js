// Bells of the signed-in agent for Part B tickets (created after SINCE). Read-only.
const SINCE=process.env.SINCE||'2026-11-14T10:20:00';const me=(await api('GET','/iam/me')).j?.data;
const n=(await api('GET','/notifications?limit=100')).j?.data;const L=Array.isArray(n)?n:(n?.data||n?.items||[]);
return {me:me?.display_name,items:L.filter(x=>(x.created_at||'')>SINCE&&/QA AO (PB|PC)/.test(x.title||'')&&!/PC27/.test(x.title||'')).map(x=>(x.created_at||'').slice(11,19)+' '+(x.event_type||x.type)+' | '+(x.title||'').slice(0,110))};
