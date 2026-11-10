let created=null;page.on('response',async r=>{if(r.request().method()==='POST'&&new RegExp('/modules/'+TK+'/records$').test(r.url())){try{const j=await r.json();created=j&&j.data&&(j.data.id||j.data.recordId);}catch(e){}}});
await page.goto(H+'/modules/'+TK+'/records/new',{waitUntil:'domcontentloaded',timeout:120000});
for(let i=0;i<40;i++){await page.waitForTimeout(2000);const t=await page.innerText('body');if(/Subject/.test(t)&&/Department/.test(t))break;}
const pick=async(label,typed,optRe)=>{const lab=page.locator(`label:text-is("${label}"), div:text-is("${label}"), span:text-is("${label}")`).filter({visible:true}).first();out["n_"+label]=await lab.count();const bb=await lab.boundingBox();if(!bb)return 'no label';await page.mouse.click(bb.x+bb.width+140,bb.y+bb.height/2);await page.waitForTimeout(2000);await page.keyboard.type(typed,{delay:60});await page.waitForTimeout(3500);const o=page.locator('[role=option], li, button').filter({hasText:optRe}).first();const n=await o.count();if(n){await o.click();await page.waitForTimeout(3000);}return n;};
await shot('b1-ui-create-form-empty');out.dept=await pick('Department','Tech',/^Tech$/);
const labAt=async l=>{const x=page.locator(`label:text-is("${l}"), div:text-is("${l}"), span:text-is("${l}")`).filter({visible:true}).first();return x.boundingBox();};
{const bb=await labAt('Contact');await page.mouse.click(bb.x+bb.width+140,bb.y+bb.height/2);await wt(/Choose a record/,30000);await page.keyboard.type('mmohamed',{delay:60});await page.waitForTimeout(4000);
 const row=page.locator('tr, [role=row]').filter({hasText:'mmohamed@anyware'}).first();out.contactRow=await row.count();
 if(out.contactRow){const cb=row.locator('input[type=checkbox]').first();if(await cb.count())await cb.check();else await row.click();await page.waitForTimeout(800);await page.locator('button:has-text("Select")').last().click();await page.waitForTimeout(3000);}}
{const bb=await labAt('Status');if(bb){await page.mouse.click(bb.x+bb.width+140,bb.y+bb.height/2);await page.waitForTimeout(2000);const o=page.locator('[role=option]').filter({hasText:/^\s*Open\s*$/}).first();out.statusOpt=await o.count();if(out.statusOpt)await o.click();else{await page.keyboard.type('Open');await page.waitForTimeout(800);await page.keyboard.press('Enter');}await page.waitForTimeout(1500);}}
const subj=page.locator('label:text-is("Subject"), div:text-is("Subject"), span:text-is("Subject")').filter({visible:true}).first();const sb=await subj.boundingBox();await page.mouse.click(sb.x+sb.width+140,sb.y+sb.height/2);await page.waitForTimeout(800);await page.keyboard.type('QA RC 1865 UI ticket');await page.waitForTimeout(1500);
out.formLines=(await body()).split('\n').filter(l=>/Tech|mahmoud|mmohamed|QA RC 1865|Open|ndc-staging-owner/.test(l)).slice(0,12);
await shot('b1-ui-create-form-filled');
await page.locator('button:has-text("Save")').filter({hasNotText:/draft|New/}).last().click();
for(let i=0;i<30&&!created;i++)await page.waitForTimeout(1000);
out.created=created;if(created)log(`CREATED ticket ${created} (QA RC 1865 UI ticket, Tech, contact de7195a2 mmohamed@anyware.software — existing contact) via New Ticket UI form`);
if(!created){await shot('b1-ui-create-save-fail');out.after=(await body()).slice(0,500);return Object.assign(out,{calls:[...new Set(calls)]});}
await page.waitForTimeout(3000);
await openTicket(created,'QA RC 1865 UI ticket');await page.waitForTimeout(3000);
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/);await page.waitForTimeout(3500);
out.first=await composerInfo();await shot('b1-ui-replyall-1-before');
const g=await api('GET',`/modules/${TK}/records/${created}`);out.fields=JSON.stringify(((g.j&&g.j.data&&g.j.data.data)||[]).filter(z=>/number|contact|email/.test(z.field)).map(z=>z.field+'='+JSON.stringify(z.value&&z.value.value))).slice(0,400);
return Object.assign(out,{calls:[...new Set(calls)]});
