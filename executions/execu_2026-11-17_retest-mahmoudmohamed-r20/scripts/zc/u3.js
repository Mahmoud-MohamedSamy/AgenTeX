const {R,M,toList,formDump}=require('./lib.js');
module.exports=async(page)=>{await toList(page);let t='';
await page.getByText('QA RT20 ZC C1').first().click({timeout:15000});for(let k=0;k<20;k++){await page.waitForTimeout(1500);t=await page.innerText('body');if(/Plan A/.test(t))break;}
await page.waitForTimeout(2000);await page.mouse.click(1427,80);await page.waitForTimeout(2000);await page.screenshot({path:R+'ZC-2841-2-menu.png'});
const menu=M(await page.innerText('body')).slice(0,3000);
const ed=page.getByText('Edit',{exact:true});if(await ed.count()){await ed.first().click();await page.waitForTimeout(5000);}
await page.screenshot({path:R+'ZC-2841-3-edit.png'});
return menu.split('\n').slice(-40).join('|')+'\nFORM '+JSON.stringify(await formDump(page));};
