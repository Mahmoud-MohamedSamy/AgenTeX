eval(fs.readFileSync('w2/lib.js','utf8'));
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',NEW='dbdbd304-652f-4bf1-b4af-f73065323d5e';
const b=body('3058 rem',{kind:'RecordUpdated'},[{type:'RemoveTags',tagIds:[NEW]}],{dept:QAO});b.criteria=guard(pre('3058 one'));
const r=await api('POST','/workflow/rules',b);const id=r.j?.data?.id;if(id)led(`workflow rule "QA RT20 W2 3058 rem" ${id} (inactive; RemoveTags QA RT20 W2 newtag; guard "QA RT20 W2 3058 one ")`);
save('t3',{id});return {s:r.s,id,err:r.s>=300?r.t.slice(0,400):undefined,acts:JSON.stringify(r.j?.data?.actions).slice(0,300)};
