// Read history of the unassigned tickets from batch 3 (last 30 created by this lane).
eval(fs.readFileSync('lib-as.js','utf8'));const R={};
for(const id of made.tickets.slice(-30)){const o=await rec(id);if(o.owner)continue;if(!/f5 |f1 |F8|E12|f6/.test(o.subject||''))continue;
 const f=await feed(id);R[o.subject+' #'+(o.ticket_number||'')]=f.map(e=>e.action+(e.summary&&e.action!=='ticket.created'?' '+JSON.stringify(e.summary).slice(0,300):'')).join(' || ');}
return R;
