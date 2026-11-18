const R='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20/screenshots/raw/';
const M=s=>s.replace(/[\w.+-]+@[\w.-]+/g,'<email>');
async function ready(page,re){for(let k=0;k<40;k++){await page.waitForTimeout(2000);const t=await page.innerText('body').catch(()=>'');if(re.test(t))break;}
 for(let i=0;i<3;i++){const nn=page.getByText('Not Now',{exact:true});if(await nn.count())await nn.first().click().catch(()=>{});await page.keyboard.press('Escape');await page.waitForTimeout(800);}
 await page.mouse.click(1450,820).catch(()=>{});await page.waitForTimeout(1500);}
module.exports={R,M,ready};
module.exports.toList=async(page)=>{const {ready}=module.exports;await ready(page,/NEW RELEASE|Contract Name/);let t='';
for(let a=0;a<3;a++){await page.getByText('Tickets',{exact:true}).first().click().catch(()=>{});await page.waitForTimeout(5000);await page.getByText('Contracts',{exact:true}).first().click().catch(()=>{});
for(let k=0;k<15;k++){await page.waitForTimeout(2000);t=await page.innerText('body');if(/QA RT20 ZC C1/.test(t))return t;}}return t;};
module.exports.formDump=async(page)=>page.$$eval('label, input, [role=combobox], select, .error, [class*=error], [class*=Error]',els=>els.filter(e=>e.offsetParent).map(e=>e.tagName+':'+((e.innerText||e.value||e.placeholder||'')+'').trim().slice(0,60)+(e.disabled||e.readOnly?'[ro]':'')).filter(s=>s.length>4).slice(0,150));
const _toList=module.exports.toList;
module.exports.toList=async(page)=>{let t=await _toList(page);if(/QA RT20 ZC C1/.test(t))return t;
 await page.mouse.click(1165,23);await page.waitForTimeout(2000);const e=page.getByText('TechEgySolutions',{exact:true});const n=await e.count();if(n)await e.last().click().catch(()=>{});
 for(let k=0;k<20;k++){await page.waitForTimeout(2000);t=await page.innerText('body');if(/QA RT20 ZC C1/.test(t))break;}return t;};
