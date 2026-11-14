I.R07=I.R07||[]; const t0=Date.now();
for(let i=I.R07.length+1;i<=200;i++){ const n=String(i).padStart(4,'0'); const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA RT17',last_name:'2807 '+n})); const id=x.j&&x.j.data&&(x.j.data.id||(x.j.data.record&&x.j.data.record.id)); if(id){I.R07.push(id);} else {log('fail '+i+' '+SR(x)); break;} if(i%50===0){SAVE();} }
SAVE(); LED('leads QA RT17 2807 0001-0200: '+I.R07.length+' (ids in out/ids.json R07)');
const r=await api('POST','/modules/'+L+'/views',{name:'QA RT17 2807 view',kind:'list',layout_id:I.LAY,visibility:'private',settings:{columns:['first_name','last_name','lead_source'],sort:null,criteria:{pattern:null,conditions:[{field:'last_name',operator:'starts_with',value:'2807 '}]},related_criteria:[]}});
I.V07=r.j&&r.j.data&&r.j.data.id; SAVE(); if(I.V07) LED('Leads view QA RT17 2807 view '+I.V07);
const lr=await api('GET','/modules/'+L+'/records?view_id='+I.V07+'&limit=5'); 
return {n:I.R07.length, secs:(Date.now()-t0)/1000, view:SR(r)+' '+(r.s>=300?r.t.slice(0,200):''), viewCount:JSON.stringify(lr.j&&lr.j.meta).slice(0,200)};
