const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const n = await api('GET','/modules/'+L+'/records/2aafefc8-9846-4cb6-8ea6-9937cc5e3105/notes?page_size=30');
const tl = await api('GET','/timeline/records/leads/2aafefc8-9846-4cb6-8ea6-9937cc5e3105/feed');
return { notes: n.s+' '+arr(n.j&&n.j.data).map(x=>x.body).join(' | '), feed: (tl.t.match(/"entry_type":"\w+"/g)||[]).join(' ') };
