async (page) => { ZLIB
const o=[];const base={name:'QA RT19 ZD Plan E',status:'ACTIVE',departmentId:'1499272000000006907',slaId:'1499272000000020033',supportType:'TICKETS'};
const vars=[{creditCycle:'MONTHLY',creditLimit:10},{creditCycle:'MONTHLY',limit:10},{creditDetails:{cycle:'MONTHLY',limit:10}},{credits:{cycle:'MONTHLY',limit:10}},{creditCycle:{type:'MONTHLY',limit:10}},{creditLimit:10},{supportCredit:{creditCycle:'MONTHLY',creditLimit:10}}];
for(const v of vars){const t=await z('POST','/api/v1/supportPlans',{...base,...v});o.push(JSON.stringify(v)+' => '+t.s+' '+(t.s<300?t.j.id:t.t.slice(0,200)));if(t.s<300)break;}
return o;}
