const {R,M,toList}=require('./lib.js');
const lab=async(page,re)=>page.$$eval('label',(e,src)=>{const r=new RegExp(src);const x=e.filter(x=>x.offsetParent&&r.test(x.innerText.trim()))[0];if(!x)return null;const b=x.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y)];},re.source);
const vals=async page=>page.$$eval('input',e=>e.filter(x=>x.offsetParent).map(x=>x.value).filter(Boolean));
const plans=async page=>M(await page.innerText('body')).split('\n').filter(s=>/QA RT20 ZC Plan|No .*found|no support plan/i.test(s));
module.exports=async(page,z)=>{await toList(page);const o={};
await page.mouse.click(1234,23);await page.waitForTimeout(6000);await page.screenshot({path:R+'ZC-2841-15-add-form.png'});
o.labels=await page.$$eval('label',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()));o.v0=await vals(page);
let d=await lab(page,/^Department/);o.dept=d;if(d){await page.mouse.click(d[0]+125,d[1]+27);await page.waitForTimeout(1500);const e=page.getByText('TechEgySolutions',{exact:true});await e.last().click().catch(()=>{});await page.waitForTimeout(3000);o.v0b=await vals(page);d=await lab(page,/^Department/);}
let sp=await lab(page,/^Support Plan/);o.sp=sp;
if(sp){await page.mouse.click(sp[0]+248,sp[1]+28);await page.waitForTimeout(4000);await page.screenshot({path:R+'ZC-2841-16-add-picker-E.png'});o.pickerE=await plans(page);
 const pa=page.getByText('QA RT20 ZC Plan A');if(await pa.count()){await pa.last().click();await page.waitForTimeout(2500);}o.vA=await vals(page);await page.screenshot({path:R+'ZC-2841-17-add-planA.png'});}
if(d){await page.mouse.click(d[0]+125,d[1]+27);await page.waitForTimeout(1500);await page.screenshot({path:R+'ZC-2841-18-add-dept-open.png'});
 const te=page.getByText('Tech',{exact:true});if(await te.count()){await te.last().click();await page.waitForTimeout(3500);}
 await page.screenshot({path:R+'ZC-2841-19-add-dept-tech.png'});o.vT=await vals(page);o.labelsT=await page.$$eval('label',e=>e.filter(x=>x.offsetParent).map(x=>x.innerText.trim()));
 sp=await lab(page,/^Support Plan/);if(sp){await page.mouse.click(sp[0]+248,sp[1]+28);await page.waitForTimeout(4000);await page.screenshot({path:R+'ZC-2841-20-add-picker-T.png'});o.pickerT=await plans(page);await page.keyboard.press('Escape');}}
return o;};
