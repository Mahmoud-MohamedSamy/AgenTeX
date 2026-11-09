// 8 Nov D-14: read the web form tickets via the form's submissions list
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const o={tickets:[]};
const S=(await api('GET','/web-forms/'+IDS.WF_D14+'/submissions?limit=20')).j.data.submissions.filter(s=>s.record_id);
for(const s of S){const id=s.record_id;const t=await getT(id);const w=await own(id);const a=arr(await act(id));
 const h=a.map(e=>(e.action||'')+(e.summary&&e.summary.rule_type?'/'+e.summary.rule_type+'/'+(e.summary.trigger||'')+'/'+nm(e.summary.owner_id):'')).filter(x=>/assign|owner|created/.test(x)).slice(0,5);
 LED('ticket "'+t.subject+'" '+id+' D-14 8 Nov web form');
 o.tickets.push({sub:t.subject,num:t.ticket_number,owner:nm(w.owner),dept:w.dept===IDS.DA?'DA':w.dept,channel:t.channel,created:s.created_at.slice(11,19),h});}
return o;
