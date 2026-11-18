const fs=require('fs');
module.exports=async(page,z)=>{const out={};for(const d of ['1499272000000006907','1499272000000432293']){const r=await page.evaluate(async(d)=>{const t=await (await fetch('/support/techegysolutions/AutoAssignmentRule.do?action=getAllAutoAssignRules&isAjax=true&deptId='+d+'&userdepid='+d,{credentials:'include'})).text();return t;},d);
fs.writeFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/rr-'+d+'.html',r.replace(/[\w.+-]+@[\w.-]+/g,'<email>'));
const txt=r.replace(/<script[\s\S]*?<\/script>/g,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');const i=txt.search(/Round Robin/i);out[d]={len:r.length,thr:[...txt.matchAll(/.{0,250}(threshold|open tickets|status type|on hold|load).{0,250}/gi)].map(m=>m[0]).slice(0,12)};}
return out;};
