eval(fs.readFileSync('wf/lib.js','utf8'));
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',TB='dd7dd3f4-7b78-4b08-a6b5-aee8942f1d1d';
const r=await mkRule('3058',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[TB],mode:'append'}],{isActive:false,departmentIds:[QAO]});
save('t1',{id:r.id});return {res:r.res,id:r.id,acts:JSON.stringify(r.r.j?.data?.actions).slice(0,300)};
