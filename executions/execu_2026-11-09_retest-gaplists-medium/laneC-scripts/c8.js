const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/evidence/raw/';
const TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',TK='88e8ea44-1658-4df3-9930-d0902b91073d',ID='3ae22630-3b08-4276-9c69-855c280c3639';
const out={blocked:[]};
const tks=arr((await api('GET',`/modules/${TK}/records?pageSize=5`)).j);const tid=tks[0]&&tks[0].id;out.tid=tid&&tid.slice(0,8);
for(const p of [`/desk/tickets/${tid}`,`/desk/tickets/${tid}/counts`,`/desk/tickets/${tid}/activities`,`/tickets/${tid}/activities`,`/desk/tickets/${tid}/summary`]){const r=await api('GET',p);out[p.replace(tid,'{id}')]={s:r.s,counts:r.s===200?JSON.stringify((r.j&&r.j.data&&(r.j.data.counts||r.j.data.count))||'').slice(0,300):undefined};}
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&!/query|search|lookup|summaries|resolved-batch/i.test(u)){out.blocked.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,60));return r.abort();}return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+`/modules/${TM}/records/${ID}`,{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);
await page.screenshot({path:D+'tavi-task-page.png'});
out.pageBtns=await page.locator('main button, header button').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText||'').trim()).filter(Boolean).slice(0,40));
// open "more" menus
const more=page.locator('button[aria-label*="ore"],button[aria-label*="ction"],button[aria-haspopup=menu]');out.moreCount=await more.count();
for(let i=0;i<Math.min(await more.count(),4);i++){await more.nth(i).click({force:true}).catch(()=>{});await page.waitForTimeout(1200);const items=await page.locator('[role=menuitem]').allInnerTexts();if(items.length){out['menu'+i]=items;await page.screenshot({path:D+`tavi-task-menu${i}.png`});}await page.mouse.click(5,450);await page.waitForTimeout(500);}
out.hasDeleteText=(await page.locator('body').innerText()).includes('Delete');
return out;
