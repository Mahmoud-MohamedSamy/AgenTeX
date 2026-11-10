const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/evidence/raw/';const out={blocked:0};
try{
const us=arr((await api('GET','/iam/users')).j);const nm=id=>(us.find(u=>u.userId===id)||{}).displayName||id.slice(0,8);
const me=await api('GET','/iam/me');out.me=(me.j&&(me.j.data||me.j)).displayName;
const deps=arr((await api('GET','/desk/departments')).j);
const pick=['HR','QA AS6 Dept B'];out.agents={};for(const n of pick){const d=deps.find(x=>x.name===n);const g=await api('GET','/desk/departments/'+d.id);out.agents[n]=((g.j.data||g.j).agent_user_ids||[]).map(nm);}
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&!/query|search|lookup/i.test(u)){out.blocked++;return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
const norm=x=>x.replace(/\s+/g,' ').trim();
for(const n of pick){
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
await page.getByRole('button',{name:/Add Activity/i}).first().click();await page.waitForTimeout(1200);
await page.getByRole('menuitem',{name:/Task/i}).first().click();await page.waitForTimeout(3000);
const owner=page.locator('[data-rule-field=owner] button[role=combobox]');const dept=page.locator('[data-rule-field=department] button[aria-haspopup=listbox]');
await owner.click({timeout:15000,force:true});await page.waitForTimeout(2500);const before=(await page.locator('[role=option]').allInnerTexts()).map(norm);out['ownersBefore_'+n]=before.length;await owner.click({force:true});await page.waitForTimeout(800);
await dept.click({timeout:15000,force:true});await page.waitForTimeout(2000);
await page.locator('[role=option]').filter({hasText:n}).first().click();await page.waitForTimeout(2000);
out['deptShown_'+n]=norm(await page.locator('[data-rule-field=department]').innerText());
await owner.click({timeout:15000,force:true});await page.waitForTimeout(2500);
const o=(await page.locator('[role=option]').allInnerTexts()).map(norm);out['ownersAfterCount_'+n]=o.length;
out['deptAgentsInList_'+n]=out.agents[n].map(g=>g+': '+o.some(x=>x.includes(g)));
out['sample_'+n]=o.filter(x=>/staging|Test User|mahamed|Mahmoud/.test(x)).slice(0,8);
await page.screenshot({path:D+'b2-owner-list-'+n.replace(/\W+/g,'_')+'.png'});await owner.click({force:true});}
}catch(e){out.err=String(e).slice(0,200);await page.screenshot({path:D+'b11-err.png'});}
return out;
