const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/evidence/raw/';
const out={};
// block writes in this browser session
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(m!=='GET'){out.blocked=(out.blocked||0)+1;return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
await page.getByRole('button',{name:/Add Activity/i}).first().click();await page.waitForTimeout(1500);
await page.screenshot({path:D+'add-menu.png'});
out.menu=(await page.locator('[role=menu],[role=menuitem]').allInnerTexts()).join(' | ');
await page.getByRole('menuitem',{name:/Task/i}).first().click().catch(e=>out.e1=String(e).slice(0,100));await page.waitForTimeout(3000);
await page.screenshot({path:D+'tavi-add-task.png'});
const dlg=page.locator('[role=dialog]').last();out.drawer=(await dlg.innerText().catch(()=>'')).split('\n').filter(Boolean).slice(0,60).join(' | ');
return out;
