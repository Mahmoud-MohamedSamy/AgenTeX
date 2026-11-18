eval(fs.readFileSync('w2/lib.js','utf8'));
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',TB='dd7dd3f4-7b78-4b08-a6b5-aee8942f1d1d';
const a=await mkRule('3058 one',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[TB],mode:'append'}],{isActive:false,departmentIds:[QAO]});
const b=await mkRule('3058 multi',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[TB],mode:'append'}],{isActive:false,departmentIds:[QAO,CS]});
const o={one:a.id||a.res,multi:b.id||b.res};save('t1',o);return o;
