const {R,M,toList}=require('./lib.js');
const labels=async page=>page.$$eval('label',e=>e.filter(x=>x.offsetParent).map(x=>{const r=x.getBoundingClientRect();return x.innerText.trim()+'@'+Math.round(r.x)+','+Math.round(r.y);}));
const vals=async page=>page.$$eval('input',e=>e.filter(x=>x.offsetParent).map(x=>{const r=x.getBoundingClientRect();return (x.value||x.placeholder)+'@'+Math.round(r.x)+','+Math.round(r.y);}));
module.exports=async(page,z)=>{await toList(page);const o={};
await page.mouse.click(1234,23);await page.waitForTimeout(5000);await page.screenshot({path:R+'ZC-2841-13-add-form.png'});
o.url=page.url();o.l1=await labels(page);o.v1=await vals(page);return o;};
