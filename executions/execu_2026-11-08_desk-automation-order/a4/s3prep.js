const out={};const S=v=>({kind:'string',stringValue:v});
for(const t of ['B10a','B10b','B11a','B11b']){const r=await mkRule(t,{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('x')}}],{isActive:false});out[t]=r.id||r.err;}
fs.writeFileSync('../a4/s3prep.json',JSON.stringify(out));return out;
