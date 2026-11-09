eval(require('fs').readFileSync(require('path').join(OUT,'../scripts/lib.js'),'utf8'));
let cur='',o={pages:0,sw:[],bulk:[]};for(let i=0;i<45;i++){const r=await api('GET','/audit/events?limit=100'+(cur?'&cursor='+encodeURIComponent(cur):''));if(r.s!==200){o.err=r.s;break;}const L=arr(r.j.data);o.pages++;
 for(const x of L){const s=JSON.stringify(x);if(/direct_rules_enabled|round_robin_rules_enabled|Direct Assignment Rules|notification.settings/i.test(s))o.sw.push({t:String(x.occurred_at).slice(0,19),who:x.actor_label||x.actor_id,ua:(x.source_user_agent||'').slice(0,30),d:s.slice(s.search(/direct_rules_enabled|round_robin_rules_enabled|settings/i)-60,s.search(/direct_rules_enabled|round_robin_rules_enabled|settings/i)+200)});
 if(String(x.occurred_at).startsWith('2026-11-08T11:17:38')&&o.bulk.length<1)o.bulk.push(s.slice(0,1100));}
 const last=L[L.length-1];if(!last||String(last.occurred_at)<'2026-11-08T10:00')break;cur=r.j.meta&&r.j.meta.next_cursor;if(!cur)break;await sleep(250);}
o.sw=o.sw.slice(0,8);return o;
