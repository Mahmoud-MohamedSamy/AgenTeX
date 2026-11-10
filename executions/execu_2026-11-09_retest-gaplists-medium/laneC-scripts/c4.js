try{
const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/evidence/raw/';
const out={blocked:[]};
const me=await api('GET','/iam/me');const myId=String((me.j&&me.j.data&&(me.j.data.userId||me.j.data.id))||'');
const deps=arr((await api('GET','/desk/departments')).j).map(d=>({id:d.id,name:d.name,ids:(d.agent_user_ids||[]).map(String)}));
out.myDepts=deps.filter(d=>d.ids.includes(myId)).map(d=>d.name);out.deptCount=deps.length;
const target=deps.find(d=>d.ids.length===1&&!d.ids.includes(myId))||deps.find(d=>d.ids.length>=1&&d.ids.length<=3);out.target={name:target.name,n:target.ids.length};
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&!/query|search|lookup/i.test(u)){out.blocked.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,60));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
await page.getByRole('button',{name:/Add Activity/i}).first().click();await page.waitForTimeout(1200);
await page.getByRole('menuitem',{name:/Task/i}).first().click();await page.waitForTimeout(3000);
const owner=page.locator('[data-rule-field=owner] button[role=combobox]');const dept=page.locator('[data-rule-field=department] button[aria-haspopup=listbox]');
out.step='owner';await owner.click({timeout:15000,force:true});await page.waitForTimeout(2500);out.ownersBefore=(await page.locator('[role=option]').allInnerTexts()).length;await owner.click({force:true});await page.waitForTimeout(800);
out.step='dept';await dept.click({timeout:15000,force:true});await page.waitForTimeout(2000);out.deptOpts=await page.locator('[role=option]').count();
await page.locator('[role=option]').filter({hasText:target.name}).first().click();await page.waitForTimeout(2000);
out.ownerAfterDept=await page.locator('[data-rule-field=owner]').innerText();
out.step='owner';await owner.click({timeout:15000,force:true});await page.waitForTimeout(2500);const after=await page.locator('[role=option]').allInnerTexts();out.ownersAfter=after.length;
await page.screenshot({path:D+'owner-after-dept.png'});
return out;}catch(e){await page.screenshot({path:"D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/evidence/raw/err.png"});return {err:String(e).slice(0,200),out};}