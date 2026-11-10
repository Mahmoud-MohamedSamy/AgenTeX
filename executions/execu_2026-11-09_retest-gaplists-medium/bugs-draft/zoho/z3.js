// Read-only: type into the Email box, tab out, screenshot. No Submit is clicked; the form is discarded.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const txt=async p=>(await p.innerText('body')).replace(/\s+/g,' ');
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
let posts=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))posts.push(r.method()+' '+r.url().slice(0,100))});
await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/contacts/new',{waitUntil:'domcontentloaded',timeout:90000});
await page.waitForTimeout(12000);posts=[];
const em=page.locator('[data-id="email"]');
for(const [v,f] of [['qa.rt2636@','invalid'],['qa.rt2636@example.com','valid']]){
 await em.fill('');await em.type(v);await page.keyboard.press('Tab');await page.waitForTimeout(2000);
 const after=await txt(page);
 const m=after.match(/.{0,60}(valid|invalid).{0,60}/ig);console.log(f,'msgs',JSON.stringify(m&&m.slice(0,4)));
 await page.screenshot({path:`raw/contact-email-${f}.png`});
}
console.log('writes',JSON.stringify(posts));
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
