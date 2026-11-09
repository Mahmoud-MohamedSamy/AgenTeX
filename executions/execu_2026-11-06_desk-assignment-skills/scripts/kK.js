eval(require('fs').readFileSync('lib.js','utf8'));
const CONV='2026-11-04T15:50:31';const o={};
let all=[];for(let p=1;p<=5;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&page_size=100');const L=arr(r.j&&r.j.data);all=all.concat(L);if(L.length<100)break;}
const old=all.filter(x=>x.created_at<CONV);
const deps=(await api('GET','/desk/departments')).j;const DN={};for(const d of arr(deps&&deps.data&&(deps.data.departments||deps.data)))DN[d.id]=d.name;
o.rows=[];o.createdSummary=null;o.ownerChanged=[];o.postConv=[];
for(const x of old){const t=fl(x);const a=await act(x.id);const A=Array.isArray(a)?a:[];
  if(!o.createdSummary){const c=A.find(e=>e.action==='ticket.created');if(c)o.createdSummary=JSON.stringify(c.summary).slice(0,400);}
  for(const e of A){if(e.action==='ticket.owner_changed')o.ownerChanged.push(t.ticket_number+' '+e.occurred_at.slice(0,16)+' '+JSON.stringify(e.summary).slice(0,250)+' actor '+JSON.stringify(e.actor).slice(0,80));
    if(e.occurred_at>=CONV&&e.occurred_at<'2026-11-04T16:00')o.postConv.push(t.ticket_number+' '+e.action+' '+e.occurred_at);}
  o.rows.push([t.ticket_number,x.created_at.slice(0,10),DN[t.department]||String(t.department).slice(0,8),t.owner?'owner':'-',t.team?'team':'-',t.status].join(' | '));}
return o;
