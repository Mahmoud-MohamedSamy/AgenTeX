const out={};
for(const lang of ['en','ar']){
 await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
 await page.evaluate(l=>{try{localStorage.setItem('anyware_language',l)}catch(e){}},lang);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(4000);
 const inp=page.locator('main input[type="search"], main input[placeholder]').first();
 log(lang+' inputs',await page.locator('main input').evaluateAll(a=>a.map(x=>x.placeholder+'|'+x.type)));
 if(await inp.count()){await inp.fill('QA RT18 WF');await sleep(3000);}
 const rows=(await page.getByRole('row').allInnerTexts()).filter(r=>/RT18|NDC ADM|GDS B2B/.test(r)).map(r=>r.replace(/\s+/g,' ').slice(0,200));
 out[lang]=rows;
 const tgt=page.getByRole('row').filter({hasText:'QA RT18 WF 2961'}).first();if(await tgt.count())await tgt.scrollIntoViewIfNeeded();
 await shot('2961-'+(lang==='en'?'1-list-en':'2-list-ar')+'.png');
}
await page.evaluate(()=>{try{localStorage.setItem('anyware_language','en')}catch(e){}});
return out;
