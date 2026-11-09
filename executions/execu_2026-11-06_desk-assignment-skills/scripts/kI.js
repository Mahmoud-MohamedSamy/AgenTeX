eval(require('fs').readFileSync('lib.js','utf8'));
const CONV='2026-11-04T15:50:31';const o={acts:{},keys:null,examples:[]};let cursor=null;const ids=[];
for(let i=0;i<70;i++){const r=await api('GET','/audit/events?app_key=desk&limit=200'+(cursor?'&cursor='+encodeURIComponent(cursor):''));const L=arr(r.j&&r.j.data);
  for(const e of L){if(e.occurred_at<CONV&&/entity\.ticket$/.test(e.target_type)&&/created/.test(e.action))ids.push(e.target_id);}
  cursor=r.j&&r.j.meta&&r.j.meta.next_cursor;if(!cursor||!L.length)break;}
o.n=ids.length;
for(const id of ids.slice(0,203)){const a=await act(id);if(!Array.isArray(a)){o.acts['notarray']=(o.acts['notarray']||0)+1;continue;}if(!o.keys&&a[0])o.keys=Object.keys(a[0]);
  for(const e of a){o.acts[e.action]=(o.acts[e.action]||0)+1;if(/assign|rule/i.test(e.action)&&o.examples.length<6)o.examples.push(JSON.stringify(e).slice(0,500));}}
return o;
