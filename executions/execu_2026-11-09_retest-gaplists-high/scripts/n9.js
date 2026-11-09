let links=[];for(let p=1;p<6;p++){const l=await api('GET','/desk/integrations/crm/links?limit=200&page='+p);const d=arr(l.j&&l.j.data);links=links.concat(d);if(d.length<50)break;}
const ok=new Map(links.filter(x=>x.kind==='contact'&&!x.needs_attention).map(x=>[x.desk_record_id,x.crm_record_id]));
let hits=[];for(let p=1;p<8&&hits.length<3;p++){const t=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?pageSize=100&page='+p);const rows=arr(t.j&&t.j.data);if(!rows.length)break;
 for(const r of rows){const c=(r.data||[]).find(d=>d.field==='contact_id');const v=c&&c.value&&c.value.value;if(v&&ok.has(v))hits.push({ticket:r.id,contact:v,crm:ok.get(v)});}}
return {links:links.length,okContacts:ok.size,hits:hits.slice(0,5)};
