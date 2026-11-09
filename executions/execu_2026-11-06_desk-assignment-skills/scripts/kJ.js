// J-04: live tickets created before the conversion
eval(require('fs').readFileSync('lib.js','utf8'));
const CONV='2026-11-04T15:50:31';const o={};
let all=[];for(let p=1;p<=15;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&page_size=100');const L=arr(r.j&&r.j.data);if(p===1){o.meta=JSON.stringify(r.j&&r.j.meta).slice(0,300);o.k=L[0]&&Object.keys(L[0]).join(',');}all=all.concat(L);if(L.length<100)break;}
o.total=all.length;const ca=x=>x.created_at||x.createdAt;
const old=all.filter(x=>ca(x)&&ca(x)<CONV);o.old=old.length;o.oldest=all.map(ca).sort()[0];
const conv=JSON.parse(fs.readFileSync('../out/conversion-report.json','utf8'));const convNames=new Set(conv.filter(e=>/assignment_rule/.test(e.target_type)).map(e=>e.target_label));
const rows=[];const actCount={};
for(const x of old){const a=await act(x.id);if(!Array.isArray(a))continue;for(const e of a)actCount[e.action]=(actCount[e.action]||0)+1;
  const pre=a.filter(e=>e.occurred_at<CONV&&e.summary&&(e.summary.rule_name||e.summary.rule_id)&&/assign/.test(e.action));
  if(!pre.length)continue;const last=pre[pre.length-1];
  const post=a.filter(e=>e.occurred_at>=CONV&&/assign|owner|team|department/.test(e.action));
  const t=fl(x);const cur=t.owner&&(t.owner.id||t.owner)||null;
  rows.push({no:t.ticket_number,created:ca(x).slice(0,16),action:last.action,rule:last.summary.rule_name,converted:convNames.has(last.summary.rule_name),ruleOwner:last.summary.owner_id||null,ruleTeam:last.summary.team_id||null,curOwner:cur,curTeam:t.team||null,post:post.map(e=>e.action+'@'+e.occurred_at.slice(0,16)+' '+JSON.stringify(e.actor||'').slice(0,60))});}
o.actCount=actCount;o.rows=rows;return o;
