await page.goto(H+'/views',{waitUntil:'domcontentloaded'}); await sleep(11000);
const row=page.locator('[role=row]').filter({hasText:'QA RT21 AC A1 bulk move ticket'}).first(); log('row',await row.count());
await row.locator('input[type=checkbox],[role=checkbox]').first().click({force:true}); await sleep(1500);
await page.getByRole('button',{name:'More',exact:true}).click(); await sleep(1200);
await shot('A1-5-bulk-more.png');
await page.getByRole('menuitem',{name:/Move to Department/}).click(); await sleep(2500);
const dl=page.locator('[role=dialog]').last(); log('dialog',(await dl.innerText()).replace(/\s+/g,' ').slice(0,600)); await shot('A1-6-move-dialog.png');
const sel=dl.locator('select,[role=combobox],button').filter({hasText:/Choose a department/}).first(); log('sel',await sel.count());
const tag=await sel.evaluate(e=>e.tagName); log('tag',tag);
if(tag==='SELECT') await sel.selectOption({label:'Sales'}); else {await sel.click(); await sleep(1000); await page.getByRole('option',{name:'Sales',exact:true}).click();}
await sleep(1200); await shot('A1-7-move-chosen.png');
await dl.getByRole('button',{name:'Move',exact:true}).click(); await sleep(5000);
log('after',(await text()).match(/[^\n]*(moved|Moved|ticket)[^\n]*/g)?.slice(0,5)); await shot('A1-8-after-move.png');
