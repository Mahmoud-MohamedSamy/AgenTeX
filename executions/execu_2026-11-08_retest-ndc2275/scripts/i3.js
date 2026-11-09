eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
// page the audit log back to 11:17 UTC on 8 Nov, list assignment-rule events around then
let cur='',o={pages:0,hits:[]};for(let i=0;i<40;i++){const r=await api('GET','/audit/events?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200){o.err=r.s;break;}const L=arr(r.j.data);o.pages++;
 for(const x of L){const t=String(x.occurred_at);if(t>='2026-11-08T11:10'&&t<='2026-11-08T11:25'&&/assignment/i.test(JSON.stringify(x)))o.hits.push({t:t.slice(11,19),actor:x.actor_id,label:x.actor_label,ch:x.source_channel,ent:x.entity_type||x.resource_type,act:x.action,s:JSON.stringify(x).slice(150,420)});}
 const last=L[L.length-1];if(!last||String(last.occurred_at)<'2026-11-08T11:10')break;cur=r.j.meta&&r.j.meta.next_cursor;if(!cur)break;await sleep(300);}
o.n=o.hits.length;o.hits=o.hits.slice(0,6);return o;
