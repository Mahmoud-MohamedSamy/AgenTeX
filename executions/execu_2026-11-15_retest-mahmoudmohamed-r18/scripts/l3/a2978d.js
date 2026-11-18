const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8'));
const g=(await api('GET','/modules/'+T+'/layout-rules/'+I.LR)).j.data;
const body={name:g.name,description:g.description,layoutId:g.layoutId,primaryField:g.primaryField,departmentIds:g.departmentIds,applyToHelpCenter:g.applyToHelpCenter,status:'disabled',branches:g.branches.map(b=>({condition:b.condition,actions:b.actions})),rowVersion:g.rowVersion};
const r=await api('PUT','/modules/'+T+'/layout-rules/'+I.LR,body); const a=(await api('GET','/modules/'+T+'/layout-rules/'+I.LR)).j.data;
fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} layout rule ${I.LR} set INACTIVE (status ${a.status}) (Desk, lane 3)\n`);
return {put:r.s+' '+(r.s>=300?r.t.slice(0,300):''), status:a.status};
