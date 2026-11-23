const fs=require('fs');const V=JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-23_retest-mahmoudmohamed-r26/scripts/k/vo.json','utf8'));const R={reqs:[]};
page.on('response',async r=>{const u=r.url();if(/\/api\/v1\/(desk|modules)/.test(u)&&!/heartbeat|summaries|read$/.test(u)&&r.request().method()!=='GET')R.reqs.push(r.request().method()+' '+u.replace(/^https:\/\/[^/]+/,'').replace(/[0-9a-f-]{36}/g,'ID')+' → '+r.status());});
const menuTxt=async()=>(await page.locator('[role=menu]:visible, [role=listbox]:visible, [role=dialog]:visible, [data-radix-popper-content-wrapper]:visible').allInnerTexts().catch(()=>[])).join(' | ').replace(/\s+/g,' ').slice(0,400);
await page.goto(H+'/views/all/tickets/'+V.t1,{waitUntil:'commit'});await page.getByText('#7132').first().waitFor({timeout:120000});await sleep(7000);
const tries=[['propStatus',415,511],['cardStatus',51,372],['cardAssign',278,289],['convDotsOwner',1566,277],['convDotsMine',1566,378],['owner',460,444],['dueDate',410,576],['tags',410,712]];
for(const [k,x,y] of tries){await page.mouse.click(x,y);await sleep(1800);R[k]=await menuTxt();await shot('3059-c-'+k+'.png');await page.keyboard.press('Escape');await sleep(800);}
return R;
