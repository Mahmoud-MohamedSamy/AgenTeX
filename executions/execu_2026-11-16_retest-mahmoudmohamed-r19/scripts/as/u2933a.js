// NDC-2933 / 2971: New Ticket form Skills field options per department (nothing saved)
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded'});await sleep(10000);
const pickDept=async name=>{await page.getByText(/Select department…|QA AS6 Dept A|QA SK13 Dept A|Sales/).first().click();await sleep(1200);
 const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill(name).catch(()=>{});await sleep(1000);}
 await page.locator('[role=option]',{hasText:name}).first().click();await sleep(2500);};
const skillsLabel=page.getByText(/^Skills$/).first();log('skills label '+await skillsLabel.count());
const openSkills=async()=>{const lab=await skillsLabel.boundingBox();const c=page.locator('button, [role=combobox], input');const n=await c.count();
 for(let i=0;i<n;i++){const bb=await c.nth(i).boundingBox().catch(()=>null);if(bb&&lab&&Math.abs((bb.y+bb.height/2)-(lab.y+lab.height/2))<24&&bb.x>lab.x){await c.nth(i).click();await sleep(1500);return true;}}
 // vertical layout: control below the label
 for(let i=0;i<n;i++){const bb=await c.nth(i).boundingBox().catch(()=>null);if(bb&&lab&&bb.y>lab.y&&bb.y-lab.y<60&&Math.abs(bb.x-lab.x)<40){await c.nth(i).click();await sleep(1500);return true;}}return false;};
const R={};
for(const d of ['Sales','QA AS6 Dept A','QA SK13 Dept A']){
 try{await pickDept(d);await skillsLabel.scrollIntoViewIfNeeded();const ok=await openSkills();const opts=(await page.locator('[role=option]').allInnerTexts()).map(x=>x.trim());R[d]={opened:ok,opts};log(d+' -> '+JSON.stringify(opts));
  await shot('2933-'+(d==='QA AS6 Dept A'?'1':'x')+'-new-ticket-skills-'+d.replace(/\W+/g,'_')+'.png');await page.keyboard.press('Escape');await sleep(600);}catch(e){log(d+' ERR '+e.message.slice(0,200));}
}
return R;
