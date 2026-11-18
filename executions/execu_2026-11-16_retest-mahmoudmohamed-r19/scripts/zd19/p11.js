async (page) => { await page.keyboard.press('Escape'); ZLIB
const o=[];const PE='1499272000000485162',PT='1499272000000485177',ACC='1499272000000426149',E='1499272000000006907';
for(const k of ['planId','slaId','supportPlans','associatedSupportPlanId','supportPlanDetails']){const b={contractName:'QA RT19 ZD C other',departmentId:E,accountId:ACC,startDate:'2026-11-16'};b[k]=k==='supportPlans'?[PT]:k==='supportPlanDetails'?{id:PT}:PT;const t=await z('POST','/api/v1/contracts',b);o.push(k+' => '+t.s+' '+(t.s<300?JSON.stringify({id:t.j.id,plan:t.j.supportPlan||t.j.supportPlanId||t.j.slaId||t.j.planId}):t.t.slice(0,200)));if(t.s<300)break;}
return o;}
