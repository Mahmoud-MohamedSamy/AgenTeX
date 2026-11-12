const L=await modId('leads');
const body={data:[{field:'first_name',value:{kind:'string',value:'QA SR1112 probe'}},{field:'lead_source',value:{kind:'string',value:'web'}},{field:'no_of_employees',value:{kind:'number',value:10}},{field:'email_opt_out',value:{kind:'boolean',value:true}}]};
const r=await api('POST','/modules/'+L+'/records',body); log('create',SR(r), r.t.slice(0,600));
const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId); I.probe=id; SAVE();
if(id){const g=await api('GET','/modules/'+L+'/records/'+id); log('get', g.t.slice(0,1500));}
const f=await fields(L); const o={}; for(const k of ['multi_select','radio_button','industry','rating']){const x=f.find(y=>y.fieldName===k); o[k]=x&&x.datatypeOptions;} return o;
