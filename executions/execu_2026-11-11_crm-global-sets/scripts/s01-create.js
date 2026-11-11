const o={};
let r=await api('POST','/global-sets',{name:'QA GS1111 Tier',description:'QA global sets run',values:[{label:'Gold'},{label:'Silver'},{label:'Bronze'}]});
if(r.j&&r.j.data){I.T=r.j.data.id; SAVE(); LED('set QA GS1111 Tier '+I.T);} const t=await gs(I.T);
RES('C1', r.s===201&&t.values.map(v=>v.label).join()=='Gold,Silver,Bronze'?'Pass':'Fail', SR(r)+' values '+t.values.map(v=>v.value+'='+v.label).join(', '));
r=await api('POST','/global-sets',{name:'QA GS1111 Tier',values:[{label:'A'}]}); RES('C3', r.s===409?'Pass':'Fail', SR(r)); if(r.s<300){LED('set dup '+r.j.data.id);}
r=await api('POST','/global-sets',{name:'qa gs1111 tier',values:[{label:'A'}]}); RES('C4', r.s>=400?'Pass':'Fail', SR(r)+(r.s<300?' — accepted a name that differs only in case (Zoho: unique)':'')); if(r.s<300){I.C4=r.j.data.id;SAVE();LED('set case-name '+I.C4);}
r=await api('POST','/global-sets',{name:'QA GS1111 C5',values:[{label:'A'},{label:'A'}]}); RES('C5', r.s>=400?'Pass':'Fail', SR(r)); if(r.s<300)LED('set C5 '+r.j.data.id);
r=await api('POST','/global-sets',{name:'QA GS1111 C6',values:[{label:'A'},{label:'a'}]}); RES('C6', r.s>=400?'Pass':'Fail', SR(r)+(r.s<300?' — A and a both stored (Zoho refuses: "Duplicate option found")':'')); if(r.s<300){I.C6=r.j.data.id;SAVE();LED('set C6 '+I.C6);}
r=await api('POST','/global-sets',{name:'QA GS1111 C7a',values:[{label:'X'.repeat(120)}]}); const c7a=r.s; if(r.s<300){LED('set C7a '+r.j.data.id);I.C7a=r.j.data.id;}
r=await api('POST','/global-sets',{name:'QA GS1111 C7b',values:[{label:'Y'.repeat(121)}]}); const c7b=SR(r); if(r.s<300){LED('set C7b '+r.j.data.id);I.C7b=r.j.data.id;}
r=await api('POST','/global-sets',{name:'QA GS1111 C7c',values:[{label:'Z'.repeat(500)}]}); const c7c=SR(r); if(r.s<300){LED('set C7c '+r.j.data.id);I.C7c=r.j.data.id;} SAVE();
RES('C7', c7a<300?'Info':'Fail', '120 chars → '+c7a+'; 121 → '+c7b+'; 500 → '+c7c+' (Zoho max 120)');
const nm=[]; for (const n of [50,51,255,256]) { r=await api('POST','/global-sets',{name:('QA GS1111 N'+'n'.repeat(400)).slice(0,n),values:[{label:'A'}]}); nm.push(n+'→'+SR(r)); if(r.s<300){LED('set name'+n+' '+r.j.data.id); (I.names=I.names||[]).push(r.j.data.id);} } SAVE();
RES('C8','Info', nm.join('; ')+' (Zoho max 50)');
const neg=[]; for (const [k,b] of [['empty name',{name:'',values:[{label:'A'}]}],['spaces name',{name:'   ',values:[{label:'A'}]}],['no values',{name:'QA GS1111 C9 novalues',values:[]}]]) { r=await api('POST','/global-sets',b); neg.push(k+'→'+SR(r)); if(r.s<300){LED('set '+k+' '+r.j.data.id);(I.neg=I.neg||[]).push(r.j.data.id);} } SAVE();
RES('C9', neg.slice(0,2).every(x=>/→4/.test(x))?'Pass':'Fail', neg.join('; '));
const nv=[]; for (const [k,v] of [['empty label',[{label:''}]],['spaces label',[{label:'   '}]]]) { r=await api('POST','/global-sets',{name:'QA GS1111 C10 '+k,values:v}); nv.push(k+'→'+SR(r)); if(r.s<300){LED('set C10 '+k+' '+r.j.data.id);(I.neg=I.neg||[]).push(r.j.data.id);} } SAVE();
RES('C10', nv.every(x=>/→4/.test(x))?'Pass':'Fail', nv.join('; '));
return 'done';
