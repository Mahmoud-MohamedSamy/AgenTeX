const {R,M,toList}=require('./lib.js');
const lab=async(page,re)=>page.$$eval('label',(e,src)=>{const r=new RegExp(src);const x=e.filter(x=>x.offsetParent&&r.test(x.innerText.trim()))[0];if(!x)return null;const b=x.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y)];},re.source);
const vals=async page=>page.$$eval('input',e=>e.filter(x=>x.offsetParent).map(x=>x.value).filter(Boolean));
module.exports=async(page,z)=>{await toList(page);const o={};
o.hdr=(await page.innerText('body')).includes('TechEgySolutions');
await page.mouse.click(1234,23);await page.waitForTimeout(6000);
const sp=await lab(page,/^Support Plan/);await page.mouse.click(sp[0]+248,sp[1]+28);await page.waitForTimeout(4000);await page.screenshot({path:R+'ZC-2841-16-add-picker-E.png'});
await page.getByText('QA RT20 ZC Plan A').last().click();await page.waitForTimeout(2500);o.vA=await vals(page);
await page.mouse.click(1165,23);await page.waitForTimeout(2000);await page.screenshot({path:R+'ZC-2841-18-add-hdr-dept-open.png'});
const te=page.getByText('Tech',{exact:true});o.techCount=await te.count();if(o.techCount)await te.last().click();
for(let i=0;i<4;i++){await page.waitForTimeout(1500);await page.screenshot({path:R+'ZC-2841-19-add-switch-t'+i+'.png'});}
o.url=page.url();o.vT=await vals(page);o.txt=M(await page.innerText('body')).split('\n').filter(s=>/discard|leave|unsaved|sure|Add Contract|Plan/i.test(s)).slice(0,10);
return o;};
