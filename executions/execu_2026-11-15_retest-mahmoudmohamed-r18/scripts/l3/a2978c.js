const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b', DB='4853562a-0b4d-45cb-ba34-9f2118fcd32c', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
if(!I.LR){ const r=await api('POST','/modules/'+T+'/layout-rules',{name:'QA RT18 2978 dept rule',description:'qa rt18 lane3',layoutId:STD,primaryField:'category',status:'active',departmentIds:[DA],branches:[{condition:{op:'eq',field:'category',value:'general'},actions:[{type:'require_fields',fields:['language']}]}]});
 o.create=r.s+' '+r.t.slice(0,400); const id=r.j&&r.j.data&&r.j.data.id; if(id){I.LR=id;SAVE();LED('layout rule "QA RT18 2978 dept rule" '+id+' (Standard layout, departmentIds [QA AO Dept A], category=general → language mandatory) ACTIVE');} }
const g=(await api('GET','/modules/'+T+'/layout-rules/'+I.LR)).j.data; o.saved={deps:g.departmentIds,status:g.status,err:g.definitionError,warn:g.warnings};
const sv=v=>({kind:'string',value:v}); I.T78=I.T78||{};
for(const [k,d] of [['A',DA],['B',DB]]){ const r=await api('POST','/modules/'+T+'/records',{layout_id:STD,data:[{field:'subject',value:sv('QA RT18 2978 dept '+k)},{field:'department',value:sv(d)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-l3@example.com')},{field:'status',value:sv('Open')},{field:'category',value:sv('general')}]});
 o['create'+k]=r.s+' '+(r.s>=300?r.t.slice(0,400):''); const id=r.j&&r.j.data&&r.j.data.id; if(id){I.T78[k]=id;SAVE();LED('ticket "QA RT18 2978 dept '+k+'" '+id);} }
return o;
