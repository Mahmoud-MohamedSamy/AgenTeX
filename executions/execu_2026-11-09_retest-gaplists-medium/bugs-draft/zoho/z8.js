// Read-only: find any ticket; if one exists, open Reply composer (no typing) and screenshot To/CC.
const path=require('path');const P='D:/Software Testing/Automation/Agentex Installation/Agentex Installation';
const {chromium}=require(path.join(P,'node_modules/playwright-core'));
const txt=async p=>(await p.innerText('body')).replace(/\s+/g,' ');
(async()=>{const b=await chromium.launch({headless:false,channel:'msedge'});
const ctx=await b.newContext({storageState:process.env.ST,viewport:{width:1600,height:900}});const page=await ctx.newPage();
for(const d of ['marketing','haytham-mohamed']){
 await page.goto(`https://desk.zoho.com/agent/techsolutionsegypt/${d}/tickets/list/all-cases`,{waitUntil:'domcontentloaded',timeout:90000});
 await page.waitForTimeout(13000);const t=await txt(page);const m=t.match(/All Tickets \(\d+\)/);console.log(d,m&&m[0]);
 const link=page.locator('a[href*="/tickets/details/"]').first();
 if(await link.count()){await link.click();await page.waitForTimeout(9000);
  const r=page.locator('text=/^Reply$/').first();console.log('reply btn',await r.count());
  if(await r.count()){await r.click();await page.waitForTimeout(5000);await page.screenshot({path:'raw/reply-composer.png'});
   const tt=await txt(page);const i=tt.indexOf('From');console.log('COMPOSER',tt.slice(i,i+300));}
  break;}
}
await b.close();})().catch(e=>{console.error('ERR',e.message);process.exit(1)});
