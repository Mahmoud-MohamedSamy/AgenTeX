const L=await modId('leads'); await delAllQA();
const r=await mkRule(L,{name:P+'E10',entries:[ent('lead_source','eq','web',10)]}); I.ruleE10=keepRule(r);
// E10 mass update
const m1=await newRec(L,{lead_source:'chat'}), m2=await newRec(L,{lead_source:'chat'});
const mu=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:[m1,m2],data:[{field:'lead_source',value:{kind:'string',value:'web'}}]});
await sleep(5000); const mus=[await recScore(L,m1),await recScore(L,m2)];
// E10 convert (K4)
const cv=await newRec(L,{last_name:P+'conv',lead_source:'web',company:P+'ConvCo',email:'conv1112@qa.test'}); const sc0=await recScore(L,cv);
const cr=await api('POST','/modules/'+L+'/records/'+cv+'/convert',{}); log('convert',SR(cr).slice(0,200), cr.t.slice(0,500));
// K8 delete + restore
const dr=await newRec(L,{lead_source:'web'}); const d0=await recScore(L,dr); const del=await api('DELETE','/modules/'+L+'/records/'+dr); const rs=await api('POST','/modules/'+L+'/records/'+dr+'/restore'); await sleep(2000); const d1=await recScore(L,dr);
RES('K8',(rs.s<300&&d1===d0)?'pass':'info','delete '+del.s+' restore '+SR(rs).slice(0,100)+'; score '+d0+' -> '+d1);
RES('E10',(mu.s<300&&mus[0]===10&&mus[1]===10)?'pass':'fail','mass update chat->web: '+SR(mu).slice(0,100)+'; scores '+mus.join(',')+' (expect 10,10). Convert: lead score '+sc0+', convert '+cr.s+'. Import / web form / blueprint not run yet.');
I.convLead=cv; I.convResp=cr.t.slice(0,2000); SAVE();
