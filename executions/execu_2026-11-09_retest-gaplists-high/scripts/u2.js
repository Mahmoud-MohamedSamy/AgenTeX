const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
await page.setViewportSize({width:1600,height:1000});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
const out={};
// Block every write while browsing settings (read-only)
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(m==='GET'||m==='HEAD'||m==='OPTIONS')return r.continue();out.blocked=(out.blocked||[]).concat(m+' '+r.request().url().split('/api/v1')[1]);return r.abort();});
await go(H+'/settings/integrations/crm');
await page.getByRole('tab',{name:'Configuration Details'}).click();await page.waitForTimeout(4000);
const rowBtn=async(label,btn)=>page.locator('tr',{hasText:label}).getByRole('button',{name:btn}).first();
// Products configure
await (await rowBtn('Products','Configure')).click().catch(e=>out.pErr=e.message);await page.waitForTimeout(3500);
await page.screenshot({path:D+'d02-products-configure.png'});
out.products=(await page.locator('[role=dialog]').innerText().catch(()=>page.locator('main').innerText())).slice(0,2500);
await page.keyboard.press('Escape');await page.waitForTimeout(1500);
// Contacts edit
await (await rowBtn('Contacts','Edit')).click().catch(e=>out.cErr=e.message);await page.waitForTimeout(4000);
await page.screenshot({path:D+'d03-contacts-edit.png'});
out.contacts=(await page.locator('[role=dialog]').innerText().catch(()=>'')).slice(0,3500);
await page.keyboard.press('Escape');await page.waitForTimeout(1500);
// Delete preference: open first select
const sel=page.getByText('On deleting a CRM contact').locator('xpath=following::*[self::button or self::select][1]');
await sel.click().catch(e=>out.sErr=e.message);await page.waitForTimeout(2000);
await page.screenshot({path:D+'d04-delete-pref-options.png'});
out.deleteOpts=(await page.locator('[role=listbox],[role=menu]').allInnerTexts().catch(()=>[])).join(' | ').slice(0,1500);
if(!out.deleteOpts){out.deleteOpts=(await sel.evaluate(e=>e.tagName==='SELECT'?[...e.options].map(o=>o.text).join(' | '):'').catch(()=>''));}
await page.keyboard.press('Escape');
return out;
