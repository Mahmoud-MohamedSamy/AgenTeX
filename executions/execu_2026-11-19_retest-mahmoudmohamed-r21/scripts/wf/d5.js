const o={};const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const rs=arr((await api('GET','/workflow/rules?take=300')).j?.data);o.n=rs.length;
const fl=new Set();const walk=c=>{if(!c)return;if(c.field)fl.add(c.field+'|'+c.kind+'|'+c.operator);(c.operands||[]).forEach(walk);};rs.forEach(r=>walk(r.criteria));o.fields=[...fl].filter(x=>/\.|status|priority|qa_/.test(x));
const st=rs.find(r=>JSON.stringify(r.criteria).includes('"field":"status"'));o.st=st&&JSON.stringify(st.criteria).slice(0,600);
const C=arr((await api('GET','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/fields?take=200')).j?.data).filter(x=>x.datatypeKey==='pick_list').map(x=>[x.apiName,x.labels?.en,JSON.stringify(x.datatypeOptions).slice(0,120)]);o.contactLists=C;
const SF=arr((await api('GET','/modules/'+T+'/fields?take=300')).j?.data).find(x=>x.apiName==='status');o.status=JSON.stringify(SF?.datatypeOptions).slice(0,400);
return o;
