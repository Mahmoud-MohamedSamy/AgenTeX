const {R,M,toList}=require('./lib.js');
const msgs=async page=>M(await page.innerText('body')).split('\n').filter(s=>/cannot|invalid|error|success|updated|required|blank|belongs/i.test(s)).slice(0,20);
const lab=async(page,re)=>page.$$eval('label',(e,src)=>{const r=new RegExp(src);const x=e.filter(x=>x.offsetParent&&r.test(x.innerText.trim()))[0];if(!x)return null;const b=x.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y)];},re.source);
const planIcon=async(page)=>{const p=await lab(page,/^Support Plan/);return p?[p[0]+248,p[1]+28]:null;};
module.exports=async(page,z)=>{await toList(page);let t='';const o={};const resp=[];
page.on('response',r=>{const m=r.request().method();if(m!=='GET'&&!/log|stats|track|beacon|presence/i.test(r.url()))resp.push(m+' '+r.status()+' '+r.url().replace(/\?.*/,'').slice(-70));});
page.on('response',async r=>{if(r.request().method()!=='GET'&&r.status()>=400){try{resp.push('BODY '+(await r.text()).slice(0,300));}catch(e){}}});
// A: edit C1 -> Tech -> open plan picker
await page.getByText('QA RT20 ZC C1').first().click({timeout:15000});for(let k=0;k<20;k++){await page.waitForTimeout(1500);t=await page.innerText('body');if(/Plan A/.test(t))break;}
await page.waitForTimeout(2000);await page.mouse.click(1427,80);await page.waitForTimeout(1500);await page.getByText('Edit',{exact:true}).first().click();await page.waitForTimeout(5000);
await page.mouse.click(360,214);await page.waitForTimeout(1500);await page.mouse.click(270,256);await page.waitForTimeout(3000);
const pi=await planIcon(page);o.pi=pi;if(pi){await page.mouse.click(pi[0],pi[1]);await page.waitForTimeout(4000);}
await page.screenshot({path:R+'ZC-2841-10-edit-tech-plan-picker.png'});
o.pickerA=M(await page.innerText('body')).split('\n').filter(s=>/Plan|QA RT|No .*found|Support/i.test(s)).slice(0,20);
const pb=page.getByText('QA RT20 ZC Plan B');o.pbCount=await pb.count();
if(o.pbCount){await pb.last().click();await page.waitForTimeout(2500);await page.screenshot({path:R+'ZC-2841-11-edit-tech-planB.png'});
 o.valsB=await page.$$eval('input',e=>e.filter(x=>x.offsetParent).map(x=>x.value).filter(Boolean));
 await page.mouse.click(75,847);o.saveB=[];for(let i=0;i<6;i++){await page.waitForTimeout(700);await page.screenshot({path:R+'ZC-2841-12-save-t'+i+'.png'});o.saveB.push(await msgs(page));}}
o.respA=[...resp];resp.length=0;
const g=await z('GET','/api/v1/contracts/1499272000000485400');o.apiA=g.s+' dept='+g.j?.departmentId+' plan='+(g.j?.supportPlan?.name);
return o;};
