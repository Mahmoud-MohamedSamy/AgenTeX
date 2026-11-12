const L=await modId('leads');
// C1 create
let r=await mkRule(L,{name:P+'Web',description:'QA',entries:[ent('lead_source','eq','web',10)]}); const w=keepRule(r);
RES('C1',r.s===201||r.s===200?'pass':'fail','API create '+SR(r)+' active='+(r.j&&r.j.data&&r.j.data.is_active)+' row_version='+(r.j&&r.j.data&&r.j.data.row_version));
I.ruleWeb=w; SAVE();
log('rule shape', JSON.stringify(r.j&&r.j.data).slice(0,700));
// C2 name empty
r=await mkRule(L,{name:'',entries:[ent('lead_source','eq','web',10)]}); keepRule(r); RES('C2',r.s===400||r.s===422?'pass':'fail','empty name '+SR(r));
r=await mkRule(L,{name:'   ',entries:[ent('lead_source','eq','web',10)]}); keepRule(r); RES('C2b',r.s>=400?'pass':'fail','blank-space name '+SR(r));
// C3
r=await mkRule(L,{name:(P+'x'.repeat(200)).slice(0,120),entries:[ent('lead_source','eq','chat',1)]}); const c3=keepRule(r);
let r2=await mkRule(L,{name:(P+'y'.repeat(200)).slice(0,121),entries:[ent('lead_source','eq','chat',1)]}); keepRule(r2);
RES('C3',(r.s<300&&r2.s>=400)?'pass':'fail','120 chars '+SR(r)+' | 121 chars '+SR(r2));
// C4 duplicate
r=await mkRule(L,{name:P+'Web',entries:[ent('lead_source','eq','chat',1)]}); keepRule(r);
r2=await mkRule(L,{name:(P+'web').toUpperCase(),entries:[ent('lead_source','eq','chat',1)]}); keepRule(r2);
let r3=await mkRule(L,{name:' '+P+'Web  ',entries:[ent('lead_source','eq','chat',1)]}); keepRule(r3);
RES('C4',r.s>=400?(r2.s>=400&&r3.s>=400?'pass':'fail'):'fail','same '+SR(r)+' | UPPER '+SR(r2)+' | spaces '+SR(r3));
// C5
const C=await modId('contacts'); r=await mkRule(C,{name:P+'Web',entries:[ent('email_opt_out','eq',true,1)]}); keepRule(r); RES('C5',r.s<300?'pass':'fail','same name in Contacts '+SR(r));
// C6
r=await mkRule(L,{name:P+'d500',description:'d'.repeat(500),entries:[ent('lead_source','eq','chat',1)]}); keepRule(r);
r2=await mkRule(L,{name:P+'d501',description:'d'.repeat(501),entries:[ent('lead_source','eq','chat',1)]}); keepRule(r2);
RES('C6',(r.s<300&&r2.s>=400)?'pass':'fail','500 '+SR(r)+' | 501 '+SR(r2));
// C7
r=await mkRule(L,{name:P+'noentries',entries:[]}); keepRule(r); RES('C7',r.s>=400?'pass':'fail','no entries '+SR(r));
// C9 points
const pts={zero:0,dec:1.5,str:'abc',strnum:'7',max:10000,over:10001,negmax:-10000,negover:-10001,nul:null}; const out=[];
for(const [k,v] of Object.entries(pts)){const x=await mkRule(L,{name:P+'pts '+k,entries:[ent('lead_source','eq','other',v)]}); keepRule(x); out.push(k+'='+x.s);}
const ok=out.join(' '); const exp={zero:'4',dec:'4',str:'4',strnum:'4',max:'2',over:'4',negmax:'2',negover:'4',nul:'4'};
const bad=out.filter(s=>{const [k,c]=s.split('=');return c[0]!==exp[k];});
RES('C9',bad.length?'fail':'pass','points '+ok+(bad.length?' UNEXPECTED: '+bad.join(','):''));
// C11 26 entries
const e26=Array.from({length:26},(_,i)=>ent('no_of_employees','eq',i+1,1));
r=await mkRule(L,{name:P+'e26',entries:e26}); keepRule(r); r2=await mkRule(L,{name:P+'e25',entries:e26.slice(0,25)}); keepRule(r2);
RES('C11',(r.s>=400&&r2.s<300)?'pass':'fail','26 '+SR(r)+' | 25 '+SR(r2));
// C12 inactive
r=await api('POST','/scoring-rules',{module_id:L,name:P+'inactive',is_active:false,entries:[ent('lead_source','eq','referral',7)]}); I.ruleInactive=keepRule(r);
RES('C12',r.j&&r.j.data&&r.j.data.is_active===false?'pass':'fail','create inactive '+SR(r));
// C16 score itself
r=await mkRule(L,{name:P+'self',entries:[ent('score','gt',5,1)]}); keepRule(r); RES('C16',r.s>=400?'pass':'fail','score field in entry '+SR(r));
// C19 duplicate entry
r=await mkRule(L,{name:P+'dupentry',entries:[ent('lead_source','eq','chat',3),ent('lead_source','eq','chat',3)]}); I.ruleDupEntry=keepRule(r);
RES('C19',r.s>=400?'pass':'info','two identical entries '+SR(r)+(r.s<300?' (accepted; Zoho refuses with ALREADY_USED; scoring effect checked in E)':''));
SAVE();
