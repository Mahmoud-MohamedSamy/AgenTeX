async (page) => { ZLIB
const o=[];const PE='1499272000000485162',PT='1499272000000485177',ACC='1499272000000426149',E='1499272000000006907',ME='1499272000000139001';
for(const [n,p] of [['other',PT],['own',PE]]){let b={contractName:'QA RT19 ZD C '+n,departmentId:E,accountId:ACC,startDate:'2026-11-16',associatedSupportPlanId:p,ownerId:ME};
for(let i=0;i<5;i++){const t=await z('POST','/api/v1/contracts',b);o.push(n+' => '+t.s+' '+(t.s<300?JSON.stringify({id:t.j.id,plan:t.j.associatedSupportPlanId,dept:t.j.departmentId}):t.t.slice(0,250)));if(t.s<300)break;const e=(t.j?.errors||[])[0];if(e&&e.errorType==='missing'){const f=e.fieldName.split('/').pop();b[f]=/Date/.test(f)?'2026-12-16':'x';}else break;}}
return o;}
