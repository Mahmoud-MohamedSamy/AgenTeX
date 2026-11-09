const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});
const writes=[];page.on('request',r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.method())&&!/heartbeat|resolved-batch|iam\/auth/.test(r.url()))writes.push(r.method()+' '+r.url().replace(/.*api\/v1/,''));});
await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Case Information',{exact:true}).waitFor({timeout:200000});await sleep(4000);
const props=async(label,file)=>{const r={};try{const l=page.getByText(label,{exact:true}).first();await l.scrollIntoViewIfNeeded();await l.hover();await sleep(800);
 await l.locator('xpath=ancestor::*[.//button][1]').getByRole('button',{name:'Field options'}).click();await sleep(1500);
 r.menu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).split('\n');
 const ep=page.getByRole('menuitem',{name:/Edit Propert|Properties|Edit/i}).first();
 if(await ep.count()){await ep.click();await sleep(3000);const d=page.locator('[role=dialog]').last();r.dialog=(await d.innerText()).slice(0,2500);await page.screenshot({path:SS+file});
  const c=d.getByRole('button',{name:/^Cancel$/});if(await c.count())await c.click();else await page.keyboard.press('Escape');await sleep(1500);}
 else{await page.keyboard.press('Escape');}}catch(e){r.e=e.message.slice(0,160);await page.keyboard.press('Escape').catch(()=>{});}return r;};
o.lookup=await props('Contact','2174-08-lookup-props.png');
o.pick=await props('Language','2174-06-picklist-props.png');
o.number=await props('QA NDC Number of assigned requ...','2174-07-number-props.png');
o.writes=writes;
return o;
