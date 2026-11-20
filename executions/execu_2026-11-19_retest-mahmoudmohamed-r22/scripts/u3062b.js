const R={};const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const pick=async(label,opt)=>{const l=page.getByText(new RegExp('^[*]?'+label+'$')).first();await l.scrollIntoViewIfNeeded();const b=l.locator('xpath=following::button[1]');await b.click({timeout:10000});await sleep(700);await page.getByRole('option',{name:new RegExp('^'+opt,'i')}).first().click({timeout:10000});await sleep(700);};
await page.goto(H+'/views/all/tickets',{waitUntil:'commit'});await page.getByText('All Tickets').first().waitFor({timeout:120000});await sleep(2000);await page.locator('button[aria-label*="another module" i]').first().click();await sleep(1500);await page.getByRole('menuitem',{name:'Ticket',exact:true}).click();await page.getByText('Create Ticket').first().waitFor({timeout:60000});await sleep(2000);
await page.locator('select').first().selectOption({label:'Test Layout Rules'});await sleep(3000);
try{
await page.getByText(/^\*?Subject$/).first().locator('xpath=following::input[1]').fill('QA RT22 BS 3062 L ui tick-untick');
await pick('Status','Open');await pick('Category','Technical');await sleep(1500);
const cb=page.getByText(/Checkbox Mandatory by/).first();await cb.scrollIntoViewIfNeeded();let t=await bt();R.req1=/This field is required/.test(t);await shot('3062-r1-a-required.png',{timeout:90000});
const box=page.getByRole('checkbox',{name:/Checkbox Mandatory by/}).first();const has=await box.count();R.cbCount=has;
const target=has?box:cb;await target.click();await sleep(800);t=await bt();R.afterTick=/This field is required/.test(t);await target.click();await sleep(800);t=await bt();R.afterUntick=/This field is required/.test(t);
R.checked=has?await box.isChecked():'?';await shot('3062-r1-b-after-untick.png',{timeout:90000});
const save=page.getByRole('button',{name:'Save',exact:true}).first();await save.click();await sleep(5000);R.urlAfterSave=page.url().replace(H,'');t=await bt();R.afterSave=(t.match(/.{0,80}(required|created|saved|error).{0,120}/i)||[])[0];await shot('3062-r1-c-after-save.png',{timeout:90000});
}catch(e){R.err=e.message.slice(0,200);await shot('3062-r1-dbg2.png',{timeout:60000}).catch(()=>{});}
return R;
