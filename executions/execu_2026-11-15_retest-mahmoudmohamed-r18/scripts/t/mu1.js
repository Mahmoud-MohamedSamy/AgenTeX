I.R07=I.R07||[]; const t0=Date.now();
for(let i=I.R07.length+1;i<=200;i++){ const n=String(i).padStart(4,'0'); const x=await api('POST','/modules/'+L+'/records',Object.assign(rec({first_name:'QA RT18',last_name:'2807 '+n,lead_source:'web'}),{layout_id:'bf971461-2edc-45f2-b6e4-6e180aa64288'})); const id=x.j&&x.j.data&&(x.j.data.id||(x.j.data.record&&x.j.data.record.id)); if(id){I.R07.push(id);} else {log('fail '+i+' '+SR(x)+' '+x.t.slice(0,300)); break;} if(i%25===0){SAVE();} }
SAVE(); LED('leads "QA RT18 2807 0001-0200" (first_name QA RT18, last_name 2807 nnnn): '+I.R07.length+' (ids in out/ids-crm9.json R07) (Leads)');
if(!I.V07){ const r=await api('POST','/modules/'+L+'/views',{name:'QA RT18 2807 view',kind:'list',visibility:'private',settings:{columns:['first_name','last_name','lead_source'],sort:null,criteria:{pattern:null,conditions:[{field:'last_name',operator:'starts_with',value:'2807 '},{field:'first_name',operator:'equals',value:'QA RT18'}]},related_criteria:[]}});
I.V07=r.j&&r.j.data&&r.j.data.id; SAVE(); if(I.V07) LED('Leads view "QA RT18 2807 view" '+I.V07+' (private)'); else log('view '+SR(r)+' '+r.t.slice(0,300)); }
const lr=await api('GET','/modules/'+L+'/records?view_id='+I.V07+'&per_page=5');
return {n:I.R07.length, secs:(Date.now()-t0)/1000, viewMeta:JSON.stringify(lr.j&&lr.j.meta).slice(0,200)};
