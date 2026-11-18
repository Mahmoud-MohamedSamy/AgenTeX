const id=process.env.WF;const tag=process.env.TAG;
await page.goto(H+'/settings/automation/workflow-rules/'+id,{waitUntil:'domcontentloaded'});await page.getByText(/Instant actions/).first().waitFor({timeout:90000});await sleep(5000);
const R={};
for(const nm of ['Add skills','Remove skills']){
 const hdr=page.getByText(new RegExp('^'+nm+'$')).first();log(nm+' hdr '+await hdr.count());
 const card=page.locator('div').filter({has:page.getByText(new RegExp('^'+nm+'$'))}).filter({has:page.getByText('Configure inline')}).last();
 if(!(await card.count())){await hdr.click();await sleep(1500);}
 const c2=page.locator('div').filter({has:page.getByText(new RegExp('^'+nm+'$'))}).filter({has:page.getByText('Configure inline')}).last();
 await c2.scrollIntoViewIfNeeded();await sleep(600);
 R[nm]=await c2.locator('label').evaluateAll(L=>L.map(l=>{const i=l.querySelector('input[type=checkbox]')||l.previousElementSibling;const on=i&&(i.checked||i.getAttribute('aria-checked')==='true'||i.getAttribute('data-state')==='checked');return l.innerText.trim().slice(0,40)+(on?' [x]':'');}).filter(x=>x&&!/Configure inline|saved action/.test(x)));
 if(!R[nm].length)R[nm+'_btn']=await c2.locator('[role=checkbox]').evaluateAll(L=>L.map(e=>(e.getAttribute('aria-label')||e.parentElement.innerText).trim().slice(0,40)+(e.getAttribute('aria-checked')==='true'||e.getAttribute('data-state')==='checked'?' [x]':'')));
 await shot(tag+'-'+nm.replace(' ','-').toLowerCase()+'.png');
 if(nm==='Add skills'){await hdr.click().catch(()=>{});await sleep(1000);}
}
return R;
