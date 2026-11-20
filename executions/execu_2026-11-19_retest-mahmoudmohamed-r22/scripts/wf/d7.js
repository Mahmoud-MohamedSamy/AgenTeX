const rs=arr((await api('GET','/workflow/rules?take=300')).j?.data);const o=[];
const walk=(c,r)=>{if(!c)return;if(['priority','language','classification','qa_ndc_transaction_type','channel','category'].includes(c.field))o.push(r.name.slice(0,40)+' | '+c.field+' '+JSON.stringify((c.values||[c.value]).map(v=>v?.stringValue)));(c.operands||[]).forEach(x=>walk(x,r));};
rs.forEach(r=>walk(r.criteria,r));
const F=arr((await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields?take=300')).j?.data).filter(x=>['priority','language','classification'].includes(x.apiName)).map(x=>x.apiName+' '+JSON.stringify(x.config).slice(0,300));
return {o:o.slice(0,15),F};
