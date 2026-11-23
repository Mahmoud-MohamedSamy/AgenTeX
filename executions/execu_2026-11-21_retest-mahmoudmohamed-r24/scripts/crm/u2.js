const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/new',{waitUntil:'commit'});await page.getByText('Exchange Rate').first().waitFor({timeout:120000});await sleep(3000);
const sel=page.locator('select').filter({hasText:'EUR'}).first();R.opts=await sel.locator('option').allInnerTexts();await sel.selectOption({label:'EUR (€)'});await sleep(1500);
let t=await bt();const k=t.indexOf('Amount');R.afterEUR=t.slice(k,k+90);await shot('crm-3106-b-deal-eur.png',{timeout:90000});
await page.goto(H+'/settings',{waitUntil:'commit'});await sleep(6000);await page.getByText('Company Settings',{exact:true}).first().click({timeout:20000}).catch(()=>{});await sleep(6000);
t=await bt();const c=t.indexOf('Currencies');R.currencies=t.slice(c,c+300);await shot('crm-3101-a-company.png',{timeout:90000,fullPage:true});
await page.getByRole('button',{name:/^Edit/}).first().click({timeout:15000}).catch(e=>R.editErr=e.message.slice(0,80));await sleep(2500);t=await bt();const m=t.search(/Currency/);R.dialog=(t.match(/.{0,120}(can.t be changed|cannot be changed|other currencies|home currency).{0,200}/i)||[])[0]||t.slice(m,m+300);
R.currencyDisabled=await page.locator('[role=dialog] select, [role=dialog] button').filter({hasText:/Egyptian|EGP/}).first().isDisabled().catch(()=>'n/a');await shot('crm-3101-b-edit-dialog.png',{timeout:90000});
return R;
