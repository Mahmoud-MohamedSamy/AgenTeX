// For batch-3 tickets: owner now, and seconds from create to auto-assign.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};
for(const id of made.tickets.slice(-30)){const o=await rec(id);if(!/f5 |f1 |F8|E12/.test(o.subject||''))continue;const f=await feed(id);
 const c=f.find(e=>e.action==='ticket.created'),a=f.find(e=>e.action==='ticket.auto_assigned');
 R[o.subject]=nm(o.owner)+(a?' after '+((new Date(a.occurred_at)-new Date(c.occurred_at))/1000).toFixed(1)+' s ('+a.summary?.trigger+')':' no auto-assign');}
return R;
