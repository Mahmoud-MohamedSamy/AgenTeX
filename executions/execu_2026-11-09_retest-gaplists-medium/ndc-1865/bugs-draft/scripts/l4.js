const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/bugs-draft/raw/tavi/';
const out={};await page.setViewportSize({width:1440,height:900});
const wt=async(re,ms=120000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await page.locator('body').innerText().catch(()=>'');if(re.test(t))return t;await page.waitForTimeout(2000);}return null;};
await page.goto(H+'/settings/security/audit-log',{waitUntil:'commit',timeout:180000});await wt(/RECENT ACTIVITY/i);await page.waitForTimeout(5000);
// try the Users filter -> mahmoud.mahamed1515
const fu=page.locator('button:has-text("All Users")').first();
if(await fu.count()){await fu.click();await page.waitForTimeout(1500);const s=page.locator('input[placeholder*="earch" i]').last();if(await s.count()){await s.fill('mahmoud.mahamed1515');await page.waitForTimeout(2500);}
 const opt=page.locator('[role=option],[role=menuitemcheckbox],[role=menuitem],label').filter({hasText:/mahmoud\.mahamed1515/}).first();out.userOpt=await opt.count();if(await opt.count()){await opt.click();await page.waitForTimeout(1500);}await page.keyboard.press('Escape');await page.waitForTimeout(4000);}
// load more until export lines appear
for(let i=0;i<15;i++){const t=await page.locator('body').innerText();if(/export/i.test(t)&&/1865 K|bulk|Title/i.test(t))break;const m=page.locator('button:has-text("Load more"),button:has-text("Show more")').first();if(await m.count()){await m.click().catch(()=>{});await page.waitForTimeout(3000);}else{await page.mouse.wheel(0,3000);await page.waitForTimeout(2500);}}
const t=await page.locator('body').innerText();out.exportLines=t.split('\n').filter(l=>/export/i.test(l)).slice(0,10);out.k=t.split('\n').filter(l=>/QA FT 1865 K|Title/i.test(l)).slice(0,10);
const ex=page.getByText(/exported the audit log|Desk data export named/i).first();if(await ex.count()){await ex.scrollIntoViewIfNeeded();await page.mouse.wheel(0,-250);await page.waitForTimeout(1500);await page.screenshot({path:D+'k2-audit-export.png'});out.k2=true;}
const mu=page.getByText(/QA FT 1865 K/).first();if(await mu.count()){await mu.scrollIntoViewIfNeeded();await page.mouse.wheel(0,-250);await page.waitForTimeout(1500);await page.screenshot({path:D+'k1-audit-massupdate.png'});out.k1=true;}
return out;
