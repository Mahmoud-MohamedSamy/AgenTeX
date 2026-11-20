const R={reqs:[]};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
page.on('request',q=>{const u=q.url();if(/\/api\/v1\/desk\/(skill|agent)/.test(u))R.reqs.push(q.method()+' '+u.replace(/^https:\/\/[^/]+/,''));});
await page.goto(H+'/settings/customization/skills',{waitUntil:'commit'});await page.getByText('tier_1_support').first().waitFor({timeout:90000});await sleep(3000);
// Edit our skill
await page.getByText('QA RT21 SK 3116 ok').first().click();await sleep(3000);let t=await bt();const k=t.indexOf('Agents');R.edit=t.slice(k,k+400);await shot('3116-r1-a-edit-skill.png',{timeout:90000});
R.mmDisabled=await page.getByLabel(/Mahmoud Mohamed/).first().isDisabled().catch(e=>'n/a '+e.message.slice(0,60));
await page.keyboard.press('Escape');await sleep(1500);
await page.getByText('Agent Skills',{exact:true}).first().click();await sleep(5000);t=await bt();const j=t.indexOf('Agent Skills');R.agentTab=t.slice(j,j+900);await shot('3116-r1-b-agent-skills.png',{timeout:90000});
return R;
