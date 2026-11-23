const R={};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H+'/settings/modules-and-fields/'+L,{waitUntil:'domcontentloaded'});
for(let i=0;i<80;i++){await sleep(3000);if(await page.getByText(/^Validation Rules$/i).count())break;}await shot('3126-mod.png');
await page.getByText(/^Validation Rules$/i).first().click();for(let i=0;i<40;i++){await sleep(3000);if(await page.locator('button[aria-label*="edit" i], button[title*="edit" i]').count())break;}await shot('3126-list.png');
R.rows=(await page.locator('table tbody tr, [role=row]').allInnerTexts()).slice(0,6).map(s=>s.replace(/\s+/g,' ').slice(0,100));
const edit=page.locator('button[aria-label*="edit" i], button[title*="edit" i]').first();R.editCount=await page.locator('button[aria-label*="edit" i], button[title*="edit" i]').count();
if(R.editCount){await edit.click();await sleep(4000);}
const dlg=page.locator('[role=dialog]:visible').last();R.dlg=await dlg.count();
if(R.dlg){const bb=await dlg.boundingBox();R.bb=bb;
 R.geom=await dlg.evaluate(d=>{const r=d.getBoundingClientRect();const items=[...d.querySelectorAll('label, input, select, button[role=combobox], textarea, [role=radiogroup], [role=switch]')].filter(e=>e.offsetParent).map(e=>{const b=e.getBoundingClientRect();return {t:e.tagName+':'+(e.innerText||e.getAttribute('placeholder')||'').trim().slice(0,30),l:Math.round(b.left-r.left),rgt:Math.round(r.right-b.right)}});return {w:Math.round(r.width),items:items.slice(0,30)};});
 R.labels=await dlg.evaluate(d=>[...d.querySelectorAll('label, h3, h4, legend, p, span')].filter(e=>e.offsetParent&&e.childElementCount===0&&e.innerText.trim().length>2&&e.innerText.trim().length<40).map(e=>{const s=getComputedStyle(e);return e.innerText.trim()+' |'+s.textTransform+'|'+s.fontSize+'|'+s.fontWeight}).slice(0,40));
 await shot('3126-dialog.png');await dlg.evaluate(d=>{const sc=[...d.querySelectorAll('*')].find(e=>e.scrollHeight>e.clientHeight+20&&getComputedStyle(e).overflowY!=='visible');if(sc)sc.scrollTop=sc.scrollHeight;});await sleep(1000);await shot('3126-dialog-bottom.png');}
return R;
