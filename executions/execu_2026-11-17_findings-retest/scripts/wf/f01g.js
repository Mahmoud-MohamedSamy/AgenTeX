eval(fs.readFileSync('wf/lib.js','utf8'));const o={};const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',ID='ec361af9-7290-48a6-8792-eb3472070509';
const us=arr((await api('GET','/iam/users?take=300&app_key=desk')).j?.data);const U=id=>id?(us.find(u=>u.userId===id)?.displayName||id.slice(0,8)):'none';
const before=(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j?.data;fs.writeFileSync(OUTD+'as6-prefs-before.json',JSON.stringify(before));
const s=await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',{...before,assign_to_offline_agents:true});o.set=s.s+' '+now()+(s.s>=300?' '+s.t.slice(0,200):'');
if(s.s<300)led('QA AS6 Dept A round-robin-preferences assign_to_offline_agents false -> true (lock held)');
await sleep(3000);
const p=await api('PATCH',`/modules/${T}/records/${ID}`,{data:[{field:'priority',value:enc('low')}]});o.patch=p.s+' '+now();
for(let i=0;i<12;i++){await sleep(5000);const g=await getTicket(ID);o.owner=U(g.owner)+' at '+now();if(g.owner)break;}
const j=(await api('GET','/desk/tickets/'+ID+'/activity')).j;const f=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);o.feed=f.map(e=>e.action+' '+(e.occurred_at||'')+' '+JSON.stringify(e.actor||'').slice(0,80)+' '+JSON.stringify(e.new_value||e.details||'').slice(0,120));
const r=await api('PUT','/desk/departments/'+DA+'/round-robin-preferences',before);o.restore=r.s;
const after=(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j?.data;o.restoredSame=JSON.stringify(after)===JSON.stringify(before);
if(r.s<300)led('QA AS6 Dept A round-robin-preferences restored (assign_to_offline_agents false), diff empty='+o.restoredSame);
save('f01g',o);return o;
