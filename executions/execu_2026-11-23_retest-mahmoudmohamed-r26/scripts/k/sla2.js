const id='1ced98ce-cbb8-482b-8ca9-f8572628c223';made.tickets.push(id);keep();LED('SLA check: UI ticket QA RT26 sla UI ticket '+id);
const o={};for(let i=0;i<6;i++){const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;const t=(await api('GET','/desk/tickets/'+id)).j?.data;o['t'+i]=new Date().toISOString().slice(11,19)+' #'+t?.ticket_number+' dept='+(t?.department_id||'').slice(0,8)+' sla='+d?.state+' '+(d?.policy?.name||'-');if(d?.state&&d.state!=='none')break;await sleep(10000);}
const r=await rec(id);o.subject=r.subject;return o;
