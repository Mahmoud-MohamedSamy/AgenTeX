const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:900});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
const out={};
await go(H+'/settings/integrations/crm');
if(/Sign in/i.test(await page.locator('body').innerText())) return {signedOut:true};
await page.screenshot({path:D+'d01-overview.png'});
const tabs=await page.getByRole('tab').allInnerTexts().catch(()=>[]);out.tabs=tabs;
for(const t of tabs){const n=t.trim();if(!n)continue;await page.getByRole('tab',{name:n}).first().click().catch(()=>{});await page.waitForTimeout(4000);
 await page.screenshot({path:D+'d-tab-'+n.replace(/[^A-Za-z]+/g,'_')+'.png',fullPage:true});
 out['text_'+n]=(await page.locator('main').innerText().catch(()=>'')).slice(0,2500);}
return out;
