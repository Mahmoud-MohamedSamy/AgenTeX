eval(fs.readFileSync('wf/lib.js','utf8'));const o={};
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',TB='dd7dd3f4-7b78-4b08-a6b5-aee8942f1d1d';
const tags=(await api('GET','/desk/tags?take=500')).j?.data?.tags||[];
o.qaTags=tags.filter(t=>/^QA WF tag/.test(t.name)).map(t=>t.name+' '+t.id.slice(0,8)+'@'+t.department_id.slice(0,8));
o.total=tags.length;o.depts=[...new Set(tags.map(t=>t.department_id))].length;
const r=await mkRule('F03',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[TB],mode:'append'}],{isActive:false,departmentIds:[QAO]});o.rule=r.res+' '+r.id;
save('f03a',{id:r.id});return o;
