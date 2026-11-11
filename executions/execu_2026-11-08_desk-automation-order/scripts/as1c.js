// A-09 debug: create inactive, activate, check state, create ticket, wait longer.
eval(fs.readFileSync('lib-as.js','utf8'));const R={};const k='AOA09x'+U;
const r=await rule('round_robin','A09x',[rrT(k,'sequential')],{active:false});R.create=E(r);const id=r.j?.data?.id;
const t1=await tk(k+' a');await sleep(4000);R.inactive=await own(t1);
const g=await getRule(id);R.versionSeen=g?.version;const p=await api('PUT','/desk/assignment-rules/'+id+'/active',{is_active:true,version:g?.version});R.activate=E(p)+' '+p.t.slice(0,160);
R.listActive=(await getRule(id))?.is_active;
const t2=await tk(k+' b');await sleep(8000);R.active=await own(t2);
R.feed=(await feed(t2)).map(e=>e.action).join(',');
R.off=await setA(id,false);
// control: a rule created active
const r2=await rule('round_robin','A09y',[rrT(k+'y','sequential')]);const t3=await tk(k+'y c');await sleep(6000);R.createdActiveControl=await own(t3);R.off2=await setA(r2.j.data.id,false);
return R;
