const out={};
const l=await api('GET','/desk/integrations/crm/links?limit=50');out.links={s:l.s,t:l.t.slice(0,800)};
const t=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?pageSize=40');
out.tickets=arr(t.j&&t.j.data).map(r=>{const g=f=>{const x=(r.data||[]).find(d=>d.field===f);return x&&x.value&&x.value.value};return [r.id,g('ticket_number')||g('number'),g('contact_id')||g('contact'),g('subject')]}).filter(x=>x[2]).slice(0,15);
return out;
