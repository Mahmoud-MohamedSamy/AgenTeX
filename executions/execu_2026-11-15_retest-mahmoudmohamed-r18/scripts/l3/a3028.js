const T='88e8ea44-1658-4df3-9930-d0902b91073d', AO='93949fbd-f9df-4e2e-ae45-00b8dc38385b', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const IF='l3/ids.json'; const I=fs.existsSync(IF)?JSON.parse(fs.readFileSync(IF,'utf8')):{}; const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1));
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
const sv=v=>({kind:'string',value:v}); const o={}; I.T28=I.T28||[];
for(let i=I.T28.length+1;i<=60;i++){ const n=String(i).padStart(2,'0'); const r=await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:sv('QA RT18 3028 '+n)},{field:'department',value:sv(AO)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-l3@example.com')},{field:'status',value:sv('Open')}]});
 const id=r.j&&r.j.data&&r.j.data.id; if(id){I.T28.push(id);} else {o.err=r.s+' '+r.t.slice(0,300); break;} }
SAVE(); LED('tickets "QA RT18 3028 01".."60" (QA AO Dept A, Open): '+I.T28.length+' ids in scripts/l3/ids.json T28');
if(!I.V28){ const r=await api('POST','/modules/'+T+'/views',{name:'QA RT18 3028 view',kind:'list',layout_id:null,visibility:'private',settings:{columns:['subject','status','priority'],sort:null,criteria:{pattern:null,conditions:[{field:'subject',operator:'starts_with',value:'QA RT18 3028'}]},related_criteria:[]}});
 o.view=r.s+' '+(r.s>=300?r.t.slice(0,300):''); I.V28=r.j&&r.j.data&&r.j.data.id; if(I.V28){SAVE();LED('private view "QA RT18 3028 view" '+I.V28);} }
const lr=await api('GET','/modules/'+T+'/records?view_id='+I.V28+'&limit=5'); o.meta=JSON.stringify(lr.j&&lr.j.meta).slice(0,200); o.n=I.T28.length;
return o;
