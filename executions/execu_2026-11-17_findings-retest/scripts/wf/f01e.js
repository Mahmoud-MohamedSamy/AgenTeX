eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const L=x=>Array.isArray(x)?x:(x?.items||x?.events||[]);
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id.slice(0,8)):'none';
const d=(await api('GET','/desk/tickets/6781c9db-484e-41ac-adce-38062b4addee')).j?.data||{};o.closed={closed_at:d.closed_at,closed_by:U(d.closed_by),resolution:d.resolution,first:Object.entries(d).filter(([k])=>/time|_at$/.test(k)).map(([k,v])=>k+'='+v).join(' ')};
const h=L((await api('GET','/desk/tickets/6781c9db-484e-41ac-adce-38062b4addee/history')).j?.data);o.hist=h.map(x=>JSON.stringify(x).slice(0,300));
const g=(await api('GET','/modules/'+T+'/records/6781c9db-484e-41ac-adce-38062b4addee')).j?.data;o.rec=(g?.data||[]).filter(x=>/clos|resol/.test(x.field)).map(x=>x.field+'='+JSON.stringify(val(x.value)));
const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';
const r2=await mkTicket('F01',{department:DA,priority:'low',owner:null},'QA AS6 SEQ rr probe 2');o.rrTicket=r2.s+' '+now()+' '+(r2.err||'');await sleep(6000);
const g0=await getTicket(r2.id);o.rrOwnerBefore=U(g0.owner);
const p3=await api('PATCH',`/modules/${T}/records/${r2.id}`,{data:[{field:'priority',value:enc('high')}]});o.rrPatch=p3.s+' '+now();
for(let i=0;i<10;i++){await sleep(5000);const g=await getTicket(r2.id);o.rrOwnerAfter=U(g.owner)+' at '+now();if(g.owner&&g.owner!==g0.owner)break;}
const h2=L((await api('GET',`/desk/tickets/${r2.id}/history`)).j?.data);o.rrHist=h2.map(x=>JSON.stringify(x).slice(0,250));
o.id=r2.id;o.num=(await api('GET','/desk/tickets/'+r2.id)).j?.data?.ticket_number;save('f01e',o);return o;
