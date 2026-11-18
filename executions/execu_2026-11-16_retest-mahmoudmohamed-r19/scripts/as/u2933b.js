// 2933: ticket page (QA AS6 Dept A ticket #4222) -> Ticket Information -> Skills edit: options offered (nothing saved)
await page.goto(H+'/views/all/tickets/cf887511-05df-4d4e-a07a-3e0616cb3141',{waitUntil:'domcontentloaded'});
await page.getByText(/R19AS33/).first().waitFor({timeout:90000}).catch(()=>{});await sleep(6000);
const props=page.getByText(/^Ticket Information$/).first();if(await props.count()){await props.scrollIntoViewIfNeeded();await props.click().catch(()=>{});await sleep(1500);}
const lab=page.getByText(/^Skills$/).first();log('skills label '+await lab.count());
if(await lab.count()){await lab.scrollIntoViewIfNeeded();await sleep(800);const bb=await lab.boundingBox();log('label '+JSON.stringify(bb));
 await page.mouse.move(bb.x+150,bb.y+bb.height/2);await sleep(600);await page.mouse.click(bb.x+150,bb.y+bb.height/2);await sleep(2000);}
const opts=(await page.locator('[role=option], [role=menuitemcheckbox], label').allInnerTexts()).map(x=>x.trim()).filter(x=>/QA|tier|billing|support|expertise|handling|management/i.test(x));log('opts '+JSON.stringify(opts.slice(0,40)));
await shot('2933-2-ticket-edit-skills.png');
const t=(await text()).replace(/\s+/g,' ');const i=t.indexOf('Skills');log(t.slice(Math.max(0,i-200),i+600));
