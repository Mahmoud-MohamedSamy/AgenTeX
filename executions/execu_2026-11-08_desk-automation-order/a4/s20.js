const out={};const S=v=>({kind:'string',stringValue:v});
const g4=arr2((await api('GET','/workflow/rules?take=500')).j?.data).filter(x=>/G4 dbl/.test(x.name));
out.E15_stored=g4.map(r=>JSON.stringify(r.criteria).match(/"stringValue":"[^"]*عربي[^"]*"/)?.[0]);
for(const n of [255,256,1000]){const r=await mkRule('C4 '+'x'.repeat(n-15),{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('x')}}],{isActive:false});out['C4_'+n]=r.s+' '+(r.err||'');}
const pad=await mkRule('C4pad',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('x')}}],{isActive:false,name:'   QA AO WF C4pad   '});
out.C4_padded=pad.s+' stored="'+(arr2((await api('GET','/workflow/rules?take=500')).j?.data).find(x=>x.id===pad.id)?.name)+'"';
for(const n of [1000,5000,10000]){const r=await mkRule('C7 '+n,{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('x')}}],{isActive:false,description:'<b>d</b>'+'y'.repeat(n-8)});out['C7_'+n]=r.s+' '+(r.err||'').slice(0,120);}
return out;
