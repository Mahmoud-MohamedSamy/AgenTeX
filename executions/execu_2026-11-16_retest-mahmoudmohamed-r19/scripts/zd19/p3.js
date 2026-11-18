async (page) => { ZLIB
const out=[];let body={name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907'};
for(let i=0;i<8;i++){const t=await z('POST','/api/v1/supportPlans',body);out.push(JSON.stringify(body)+' => '+t.s+' '+t.t.slice(0,260));if(t.s<300)break;
const e=(t.j?.errors||[])[0];const m=t.j?.message||'';if(e&&e.errorType==='missing'){const f=e.fieldName.replace('/','');body[f]={supportType:'TICKET_BASED',supportPlanType:'TICKET_BASED',type:'TICKET_BASED'}[f]||(f.endsWith('Id')?'0':'x');}else if(/extra parameter '(\w+)'/.test(m)){delete body[m.match(/'(\w+)'/)[1]];}else break;}
return out;}
