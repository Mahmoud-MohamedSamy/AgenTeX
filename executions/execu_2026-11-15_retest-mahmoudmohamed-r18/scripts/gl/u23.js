const ART='6d2442dc-41b0-4990-9317-18e850f1a476'; const out={}; const net=[];
page.on('response',async r=>{ if(r.url().includes('/translations') && r.request().method()!=='GET'){ net.push(r.request().method()+' '+r.status()+' '+(r.request().postData()||'').slice(0,300)); }});
await page.goto(H+'/knowledge-base/articles/'+ART,{waitUntil:'domcontentloaded'}); await sleep(12000);
await page.locator('main button').filter({hasText:/^Translations$/}).first().click(); await sleep(2500);
for (const [lang,txt,title] of [['French','abc def 123','QA RT18 FR'],['Arabic','abc def 123 مرحبا','QA RT18 AR']]) {
  await page.locator('main button').filter({hasText:new RegExp('^'+lang)}).first().click(); await sleep(4000);
  const anchor=page.getByText(new RegExp('^'+lang+' · ')).last(); const inputs=anchor.locator("xpath=following::input[not(@type) or @type='text']");
  await inputs.nth(0).fill(title).catch(e=>out[lang+'tErr']=e.message.slice(0,80));
  const body=page.locator('[aria-label=Body]').first(); await body.click(); await page.keyboard.type(txt,{delay:60}); await sleep(800);
  out[lang+'_typed']=(await body.innerText()).trim();
  await shot('3001-'+(lang==='French'?'1':'2')+'-typed-'+lang.toLowerCase()+'.png');
  await page.getByRole('button',{name:'Save translation'}).last().click().catch(e=>out[lang+'sErr']=e.message.slice(0,80)); await sleep(4000);
  const d=page.locator('[role=dialog]').last(); if(await d.count()){ out[lang+'dlg']=(await d.innerText()).replace(/\s+/g,' ').slice(0,200); await d.getByRole('button',{name:/^(Publish|Save|Confirm)/}).last().click().catch(()=>{}); await sleep(3000);}
}
out.net=net; return out;
