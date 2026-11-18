const L=Ls((await api('GET','/modules/'+TK+'/blueprints?limit=200')).j?.data);const out=[];
for(const b of L){const d=b.definition||(await api('GET','/modules/'+TK+'/blueprints/'+b.id)).j?.data?.definition;const acts=[];for(const t of (d?.transitions||[]))for(const a of (t.after?.actions||[]))if(a.kind==='sendNotification')acts.push(a);if(acts.length)out.push({name:b.name||d.name,active:b.isActive??b.is_active,acts:MASK(JSON.stringify(acts)).slice(0,700)});}
return {n:L.length,out:out.slice(0,6)};
