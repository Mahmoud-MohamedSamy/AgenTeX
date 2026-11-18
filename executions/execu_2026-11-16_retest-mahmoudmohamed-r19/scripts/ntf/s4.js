const keys=new Set();const ex=[];let names=[];
for(const q of ['?limit=200','?limit=200&include_inactive=true','?status=all&limit=200']){const L=Ls((await api('GET','/modules/'+TK+'/blueprints'+q)).j?.data);names=names.concat(L.map(b=>b.name));
for(const b of L){const d=(await api('GET','/modules/'+TK+'/blueprints/'+b.id)).j?.data?.definition||b.definition;for(const t of (d?.transitions||[]))for(const a of (t.after?.actions||[]))if(a.kind==='sendNotification'){Object.keys(a).forEach(k=>keys.add(k));if(Object.keys(a).length>4)ex.push(MASK(JSON.stringify(a)).slice(0,400));}}}
return {keys:[...keys],ex:ex.slice(0,3),names:[...new Set(names)]};
