// Form default owner, no RR in Dept B: is the shown owner saved?
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O (creator)';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
await page.setViewportSize({width:1600,height:1000});const o={};
const field=lbl=>page.locator('main').locator('div').filter({has:page.locator('label',{hasText:new RegExp('^[*]?'+lbl+'$')})}).last();
await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'commit'});await page.waitForFunction(()=>/Ticket Information/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(2500);
await field('Department').getByText('Customer Support').first().click();await page.waitForTimeout(800);await page.getByRole('option',{name:'QA AS6 Dept B'}).first().click();await page.waitForTimeout(800);
const subject='QA AS6 FORMOWN default owner no rules';await field('Subject').locator('input').first().fill(subject);
await field('Status').getByText('Select').first().click();await page.waitForTimeout(600);await page.getByRole('option',{name:/^Open$/}).first().click();await page.waitForTimeout(500);
o.ownerShown=(await field('Ticket Owner').innerText()).replace(/\s+/g,' ');
const reqs=[];page.on('request',r=>{if(r.method()==='POST'&&/\/records$/.test(r.url()))reqs.push((r.postData()||'').slice(0,1500));});
await page.screenshot({path:'../screenshots/ev-B4-form-before-save.png'});
await page.getByRole('button',{name:/^Save$/}).last().click();await page.waitForTimeout(6000);
const id=(page.url().match(/([0-9a-f]{8}-[0-9a-f-]{27})/)||[])[1];o.id=id;if(id)LED('ticket "'+subject+'" '+id+' form owner check');
o.postHasOwner=reqs.map(b=>/"owner"/.test(b)?(b.match(/"field":"owner".{0,120}/)||[''])[0]:'no owner field in POST');
if(id){const w=await own(id);o.ownerSaved=nm(w.owner);o.hist=(await hist(id)).slice(0,3);
 await page.waitForTimeout(1500);await page.screenshot({path:'../screenshots/ev-B4-ticket-after-save.png'});
 const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(3500);}await page.screenshot({path:'../screenshots/ev-B4-ticket-history.png'});}
return o;
