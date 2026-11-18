const go=async id=>{await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Edit Skills'}).waitFor({state:'attached',timeout:90000});await sleep(4000);};
const abs=async(id,tag)=>{await go(id);
 const more=page.locator('button[aria-label*="ore" i], button[aria-haspopup=menu]').filter({hasNotText:/Reply|Actions/});log('more btns '+await more.count());
 // ⋯ next to Actions at the top right
 const cand=await page.locator('button').evaluateAll(L=>L.map((e,i)=>{const r=e.getBoundingClientRect();return {i,x:r.x,y:r.y,t:(e.innerText||e.getAttribute('aria-label')||'').trim()};}).filter(o=>o.y<130&&o.x>1500));log('top-right '+JSON.stringify(cand));
 await page.locator('button').nth(cand[cand.length-1].i).click();await sleep(1200);
 log('menu '+JSON.stringify(await page.locator('[role=menuitem]').allInnerTexts()));
 await page.getByRole('menuitem',{name:/Assign by Skills/i}).click();await sleep(4000);
 log(tag+' after: '+((await text()).match(/[^\n]*(skill|assigned)[^\n]*/gi)||[]).slice(0,8).join(' || '));
 await shot(tag+'.png');};
await abs('f0ccb075-4a50-448d-823b-67e1bfca6354','2931-2-ui-assign-by-skills-S3S2');
const o=page.getByText(/^Ticket Owner/).first();log('owner block '+(await o.evaluate(e=>e.parentElement.parentElement.innerText)).replace(/\n/g,' | ').slice(0,200));
await abs('90ac01c0-3029-4999-9918-3e5437709e01','2931-3-ui-assign-by-skills-S3only');
