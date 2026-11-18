// NDC-3046 screen: New Ticket in QA AS6 Dept A, subject with rule A key, Status Open, Ticket Owner cleared -> Save. env SUBJ
const resp=[];page.on('response',async r=>{const q=r.request();if(q.method()==='POST'&&/\/modules\/[^/]+\/records$/.test(r.url())){let b='';try{b=(await r.text()).slice(0,160);}catch(e){}resp.push({s:r.status(),b});}});
await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new',{waitUntil:'domcontentloaded'});await sleep(10000);
await page.getByText(/Select department…|^Sales$|QA AS6 Dept A/).first().click();await sleep(1200);
const inp=page.locator('[role=listbox] input, [role=dialog] input, input[placeholder*="earch"]').last();if(await inp.count()){await inp.fill('QA AS6 Dept A').catch(()=>{});await sleep(1000);}
await page.locator('[role=option]',{hasText:'QA AS6 Dept A'}).first().click();await sleep(2500);
await page.getByPlaceholder('Type or pick a subject').fill(process.env.SUBJ);await page.keyboard.press('Escape');await sleep(500);
const lab=await page.getByText(/^[\s*]*Status[\s*]*$/).first().boundingBox({timeout:8000});
const cands=page.locator('button, [role=combobox]');const cn=await cands.count();
for(let i=0;i<cn;i++){const bb=await cands.nth(i).boundingBox().catch(()=>null);if(bb&&lab&&Math.abs((bb.y+bb.height/2)-(lab.y+lab.height/2))<20&&bb.x>lab.x&&bb.x-lab.x<250){await cands.nth(i).click();await sleep(900);await page.locator('[role=option]',{hasText:/^Open$/}).first().click();break;}}
await sleep(600);
// clear Ticket Owner (the x next to the owner)
const ol=await page.getByText(/^Ticket Owner$/).first().boundingBox();
const ob=page.locator('div').filter({hasText:/^N?s*ndc-staging-owner$/}).last();let cleared=false;
if(ol){await page.mouse.click(1367,ol.y+ol.height/2+2);cleared=true;}
await sleep(800);log('owner cleared '+cleared);
const ownTxt=(await text()).match(/Ticket Owner\s*\n?\s*([^\n]{0,40})/);log('owner field '+JSON.stringify(ownTxt&&ownTxt[1]));
await shot('3046-1-new-ticket-form-filled.png');
await page.getByRole('button',{name:'Save',exact:true}).click({force:true});await sleep(9000);
await shot('3046-2-after-save.png');
log('resp '+JSON.stringify(resp));log('url '+page.url());
return {resp,url:page.url()};
