const R={step:[]};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
try{
await page.goto(H+'/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3',{waitUntil:'commit'});await sleep(9000);
await page.getByText('Layout Rules',{exact:true}).first().click({timeout:15000});await sleep(5000);
await page.getByRole('button',{name:/New (Layout )?Rule|Create rule|Add rule/i}).first().click();await sleep(4000);R.step.push('new');
await page.getByText('Choose the field the rule is about').first().click({timeout:10000});await sleep(800);
await page.getByRole('option',{name:/^Lead Status/}).first().click({timeout:10000});await sleep(2500);R.step.push('primary');
R.btns=(await page.locator('main button:visible').allInnerTexts()).map(s=>s.trim()).filter(s=>s.length>0&&s.length<40).slice(0,40);
const act=page.locator('select').filter({hasText:'Show fields'}).first();
if(await act.count()){R.actOpts=await act.locator('option').allInnerTexts();await act.selectOption({label:'Show related lists'});}else{await page.getByText('Show fields',{exact:true}).first().click();await sleep(800);await page.getByRole('option',{name:/Show related lists/}).first().click();}
await sleep(2000);await page.getByText(/^Choose/).first().click({timeout:10000});await sleep(2000);
R.items=(await page.locator('[role=option],[role=menuitemcheckbox],[role=menuitem],label').allInnerTexts()).map(s=>s.trim()).filter(s=>s.length>0&&s.length<60);
await shot('crm-2995-a-picker.png',{timeout:90000});
}catch(e){R.err=e.message.slice(0,150);await shot('crm-2995-dbg.png',{timeout:60000}).catch(()=>{});}
return R;
