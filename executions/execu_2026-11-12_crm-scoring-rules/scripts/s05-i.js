const L=await modId('leads');
await delAllQA();
const t=async(op,val)=>{const r=await mkRule(L,{name:P+'op '+op,entries:[ent('company',op,val,1)]});const id=keepRule(r);let s='';if(id){const rec=await newRec(L,{company:'Acme Ltd'});s=' score(Acme Ltd)='+(await recScore(L,rec));await api('DELETE','/scoring-rules/'+id);}return op+':'+r.s+s;};
const out=[];for(const [o,v] of [['regexMatches','^Acme'],['lengthEq',8],['isEmpty',undefined],['and',[]],['not',null]])out.push(await t(o,v));
RES('I6',out.some(x=>/:20/.test(x))?'fail':'pass','operators not offered in the screen, sent by API: '+out.join(' | '));
// I2 type confusion
const cs=[['points "10"',{name:P+'i2a',entries:[ent('lead_source','eq','web','10')]}],['value object',{name:P+'i2b',entries:[ent('lead_source','eq',{a:1},1)]}],['entries object',{name:P+'i2c',entries:{a:1}}],['is_active "yes"',{name:P+'i2d',is_active:'yes',entries:[ent('lead_source','eq','web',1)]}],['name number',{name:12345,entries:[ent('lead_source','eq','web',1)]}]];
const o2=[];for(const [k,b] of cs){const r=await api('POST','/scoring-rules',{module_id:L,...b});keepRule(r);o2.push(k+'='+r.s+(r.s<300?' (accepted)':''));}
RES('I2',o2.filter(x=>x.includes('accepted')).length?'info':'pass','type confusion: '+o2.join(' | '));
await delAllQA();
// I3 random ids
const rid='00000000-0000-0000-0000-000000000001'; const g=await api('GET','/scoring-rules/'+rid), p=await api('PUT','/scoring-rules/'+rid,{name:'x',entries:[],row_version:1}), d=await api('DELETE','/scoring-rules/'+rid), a=await api('PATCH','/scoring-rules/'+rid+'/active',{is_active:false});
const bm=await api('GET','/scoring-rules?module_id='+rid); const bad=await api('GET','/scoring-rules/not-a-uuid');
RES('I3',[g,p,d,a].every(x=>x.s===404)?'pass':'info','random id GET '+g.s+' PUT '+p.s+' DELETE '+d.s+' PATCH '+a.s+'; unknown module list '+SR(bm).slice(0,120)+'; non-uuid id '+bad.s);
// I4
let r=await mkRule(L,{name:P+'i4',entries:[ent('account_name','eq','x',1)]}); keepRule(r); RES('I4',r.s>=400?'pass':'fail','field key that leads do not have '+SR(r).slice(0,200));
// I5
const many=Array.from({length:1000},(_,i)=>'v'+i); r=await mkRule(L,{name:P+'i5',entries:[ent('lead_source','in',many,1)]}); keepRule(r);
let big=await api('POST','/scoring-rules',{module_id:L,name:P+'i5b',description:'x'.repeat(3e6),entries:[ent('lead_source','eq','web',1)]}); keepRule(big);
RES('I5',(r.s<500&&big.s<500)?'pass':'fail','1000 values on "is any of": '+SR(r).slice(0,160)+' | 3 MB body '+big.s);
// I6b
r=await api('POST','/scoring-rules',{module_id:L,name:P+'i6b',entries:[{kind:'signal',field_key:'lead_source',operator:'eq',value:'web',points:1}]}); keepRule(r);
let r2=await api('POST','/scoring-rules',{module_id:L,name:P+'i6c',layout_id:rid,score_field:'x',entries:[ent('lead_source','eq','web',1)]}); keepRule(r2);
RES('I6b',r.s>=400?'pass':'fail','entry kind "signal" '+SR(r).slice(0,160)+' | unknown top-level keys '+r2.s+(r2.s<300?' (ignored)':''));
await delAllQA();
// H group
r=await mkRule(L,{name:P+'H',entries:[ent('lead_source','eq','web',1)]}); const h=keepRule(r); const g1=(await api('GET','/scoring-rules/'+h)).j.data;
const body={name:g1.name,description:null,is_active:true,entries:g1.entries.map(e=>({id:e.id,field_key:e.field_key,operator:e.operator,value:e.value,points:2}))};
const nov=await api('PUT','/scoring-rules/'+h,body); RES('H2',nov.s>=400?'pass':'fail','PUT without row_version '+SR(nov).slice(0,200));
const gA=(await api('GET','/scoring-rules/'+h)).j.data;
const ok1=await api('PUT','/scoring-rules/'+h,{...body,row_version:gA.row_version}); const stale=await api('PUT','/scoring-rules/'+h,{...body,row_version:gA.row_version});
RES('H3',(ok1.s<300&&stale.s===409)?'pass':'fail','fresh '+ok1.s+' then the same old row_version '+SR(stale).slice(0,200));
const g2=(await api('GET','/scoring-rules/'+h)).j.data; const C=await modId('contacts');
const mv=await api('PUT','/scoring-rules/'+h,{...body,module_id:C,row_version:g2.row_version}); const g3=(await api('GET','/scoring-rules/'+h)).j.data;
RES('H6',(mv.s>=400||g3.module_id===L)?'pass':'fail','PUT with Contacts module_id '+SR(mv).slice(0,160)+'; module after='+(g3.module_id===L?'leads':'CHANGED'));
const part=await api('PUT','/scoring-rules/'+h,{name:P+'H renamed',row_version:g3.row_version}); const g4=(await api('GET','/scoring-rules/'+h)).j.data;
RES('H7',(part.s>=400||g4.entries.length===1)?'pass':'fail','PUT with only name '+SR(part).slice(0,160)+'; entries after='+g4.entries.length);
const [d1,d2]=await Promise.all([mkRule(L,{name:P+'dbl',entries:[ent('lead_source','eq','web',1)]}),mkRule(L,{name:P+'dbl',entries:[ent('lead_source','eq','web',1)]})]); keepRule(d1);keepRule(d2);
const cnt=arr((await api('GET','/scoring-rules?module_id='+L)).j.data).filter(x=>x.name===P+'dbl').length;
RES('H4',cnt===1?'pass':'fail','two parallel creates with the same name: '+d1.s+'/'+d2.s+', rules saved='+cnt+' (API level; UI double-click checked separately)');
await api('DELETE','/scoring-rules/'+h); const ed=await api('PUT','/scoring-rules/'+h,{...body,row_version:g4.row_version}); RES('H8',ed.s===404?'pass':'fail','edit a deleted rule '+SR(ed).slice(0,160));
await delAllQA(); const made=[];for(let i=0;i<50;i++){const x=await mkRule(L,{name:P+'lim '+i,entries:[ent('lead_source','eq','web',1)]});if(keepRule(x))made.push(1);}
const n51=await mkRule(L,{name:P+'lim 51',entries:[ent('lead_source','eq','web',1)]}); keepRule(n51);
RES('H5',(made.length===50&&n51.s>=400)?'pass':'fail','created '+made.length+'; 51st '+SR(n51).slice(0,200));
SAVE();
