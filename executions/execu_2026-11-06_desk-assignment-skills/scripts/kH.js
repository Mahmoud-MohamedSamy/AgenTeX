// 7 Nov J-04 (MIG-6): tickets assigned by old rules before the 4 Nov 15:50 UTC conversion keep owner + history
eval(require('fs').readFileSync('lib.js','utf8'));
const CONV='2026-11-04T15:50:31';const o={};
const conv=JSON.parse(fs.readFileSync('../out/conversion-report.json','utf8'));const convNames=new Set(conv.filter(e=>/assignment_rule/.test(e.target_type)).map(e=>e.target_label));
const ids=new Map();let cursor=null,pages=0;
for(let i=0;i<70;i++){const r=await api('GET','/audit/events?app_key=desk&limit=200'+(cursor?'&cursor='+encodeURIComponent(cursor):''));const L=arr(r.j&&r.j.data);pages++;
  for(const e of L){if(e.occurred_at<CONV&&/entity\.ticket$/.test(e.target_type)&&/created/.test(e.action))ids.set(e.target_id,e.occurred_at);}
  cursor=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cursor||!L.length)break;}
o.pages=pages;o.ticketsBefore=ids.size;
const rows=[];let checked=0;
for(const [id,at] of ids){if(checked>=120)break;checked++;
  const a=await act(id);if(!Array.isArray(a))continue;
  const pre=a.filter(e=>(e.occurred_at||e.created_at)<CONV&&/assign/.test(e.action)&&e.summary&&e.summary.rule_name);
  if(!pre.length)continue;
  const post=a.filter(e=>(e.occurred_at||e.created_at)>=CONV&&/assign|owner|team/.test(e.action));
  const last=pre.sort((x,y)=>(x.occurred_at||x.created_at)<(y.occurred_at||y.created_at)?-1:1).slice(-1)[0];
  const t=await getT(id);const cur=t.owner&&(t.owner.id||t.owner)||null;
  rows.push({no:t.ticket_number,created:at.slice(0,16),rule:last.summary.rule_name,converted:convNames.has(last.summary.rule_name),ruleOwner:last.summary.owner_id||null,ruleTeam:last.summary.team_id||null,curOwner:cur,curTeam:t.team||null,same:(last.summary.owner_id||null)===cur,postChanges:post.map(e=>e.action+'@'+String(e.occurred_at||e.created_at).slice(0,16)+' by '+(e.actor_label||e.actor_name||e.actor_type||'?')),deleted:t.err||null});}
o.checked=checked;o.withOldRule=rows.length;o.rows=rows;
o.sampleKeys=rows.length?null:'none';
return o;
