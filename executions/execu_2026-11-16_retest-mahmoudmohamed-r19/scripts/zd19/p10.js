async (page) => { ZLIB
const o=[];const PE='1499272000000485162',PT='1499272000000485177',ACC='1499272000000426149',E='1499272000000006907';
const tryc=async(name,sp)=>{let body={contractName:name,departmentId:E,accountId:ACC,startDate:'2026-11-16',supportPlan:{id:sp}};
for(let i=0;i<6;i++){const t=await z('POST','/api/v1/contracts',body);o.push(name+' '+JSON.stringify(body).slice(0,200)+' => '+t.s+' '+(t.s<300?JSON.stringify({id:t.j.id,sp:t.j.supportPlan||t.j.supportPlanId}):t.t.slice(0,250)));if(t.s<300)return t.j.id;
const e=(t.j?.errors||[])[0];const m=t.j?.message||'';
if(/extra parameter 'supportPlan'/.test(m)){delete body.supportPlan;body.productId=undefined;body.supportPlanId=sp;delete body.productId;body={...body};if(i>0)break;}
else if(e&&e.errorType==='missing'){const f=e.fieldName.split('/').pop();body[f]=/Date/.test(f)?'2026-12-16':/Id$/.test(f)?ACC:'x';}else break;}return null;};
o.push('own='+await tryc('QA RT19 ZD C own',PE));o.push('other='+await tryc('QA RT19 ZD C other',PT));return o;}
