const sid='85ec5cfa-6b19-4ccb-84da-c5eb0ab45859'; I.IMP=sid; SAVE(); const base='/modules/'+L+'/import/'+sid; const o={};
const f=await api('GET',base+'/fields'); const tf=arr(f.j&&f.j.data).find(x=>/qa_gs1111_r2/.test(JSON.stringify(x))); o.fieldInfo=JSON.stringify(tf||f.j).slice(0,400);
const maps=[{header:'First Name',field:'first_name'},{header:'Last Name',field:'last_name'},{header:'QA GS1111 R2',field:'qa_gs1111_r2'}];
let m=await api('PUT',base+'/mapping',{mapping:maps}); o.map=SR(m); if(m.s>=300){ m=await api('PUT',base+'/mapping',{mappings:maps}); o.map2=SR(m)+' '+m.t.slice(0,200); }
const v=await api('POST',base+'/validate'); o.validate=SR(v)+' '+JSON.stringify(v.j&&v.j.data).slice(0,300);
await sleep(3000); const is=await api('GET',base+'/issues?page=1&size=50'); o.issues=SR(is)+' '+JSON.stringify(is.j&&is.j.data).slice(0,700);
return o;
