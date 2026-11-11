const o={};
const mkF=async(mod,name,vals,label)=>{ const r=await api('POST','/modules/'+mod+'/fields',{fields:[{fieldName:name,labels:{en:label},datatypeKey:'pick_list',datatypeOptions:{allowed_values:vals},config:{allowed_values:vals}}]}); const d=r.j&&r.j.data; const id=d&&(Array.isArray(d)?d[0].id:(d.fields?d.fields[0].id:d.id)); if(id) LED('field '+name+' on '+(mod===L?'Leads':'Contacts')+' '+id); return id||('ERR '+SR(r)); };
I.fL=await mkF(L,'qa_gs1111_tier',['Gold','Silver','Bronze'],'QA GS1111 Tier'); I.fC=await mkF(I.C,'qa_gs1111_tier',['Gold','Silver','Bronze'],'QA GS1111 Tier'); SAVE();
for (const [m,f] of [[L,I.fL],[I.C,I.fC]]) { const p=await api('GET','/global-sets/'+I.T+'/association-preview?module_id='+m+'&field_id='+f); const a=await api('POST','/global-sets/'+I.T+'/associate',{module_id:m,field_id:f,mappings:{}}); o['assoc_'+(m===L?'L':'C')]=SR(p)+' / '+SR(a); }
const t=await gs(I.T); o.fields=t.fields.map(f=>f.module_key+'.'+f.field_name);
RES('I2', t.fields.length===2?'Pass':'Fail', 'set linked to '+o.fields.join(', ')+' — '+JSON.stringify(o));
// records
const mkR=async(mod,vals,tag)=>{ const r=await api('POST','/modules/'+mod+'/records',rec(vals)); const d=r.j&&r.j.data; const id=d&&(d.id||(d.record&&d.record.id)); if(id) LED('record '+tag+' '+id); return id||('ERR '+SR(r)); };
I.L1=await mkR(L,{first_name:'QA GS1111',last_name:'L1 Silver',qa_gs1111_tier:'Silver'},'lead L1');
I.L2=await mkR(L,{first_name:'QA GS1111',last_name:'L2 Bronze',qa_gs1111_tier:'Bronze'},'lead L2');
I.L3=await mkR(L,{first_name:'QA GS1111',last_name:'L3 Gold',qa_gs1111_tier:'Gold',qa_gs1111_local:'Platinum'},'lead L3');
I.C1=await mkR(I.C,{first_name:'QA GS1111',last_name:'C1 Silver',qa_gs1111_tier:'Silver'},'contact C1');
SAVE(); o.recs=[I.L1,I.L2,I.L3,I.C1];
const bad=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:'Lbad',qa_gs1111_tier:'NotAValue'})); if(bad.s<300){const id=bad.j.data.id||bad.j.data.record.id; LED('record Lbad '+id); I.Lbad=id; SAVE();}
RES('I11', bad.s>=400?'Pass':'Fail', 'record with a value not in the set → '+SR(bad)+' (Zoho stores it; TAVI should refuse)');
return o;
