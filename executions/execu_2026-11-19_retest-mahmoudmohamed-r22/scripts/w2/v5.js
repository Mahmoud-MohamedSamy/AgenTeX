// env: RULES="key:id,..." LANG=en|ar  APP=desk|crm
const main=()=>page.locator('main').last();const R={};const L=process.env.LANGX||'en';
await ctx.route(u=>true,r=>{const q=r.request();if(q.method()!=='GET'&&!/resolved-batch|heartbeat|negotiate|realtime|query|search|batch|lookup/i.test(q.url()))return r.abort();return r.continue();});
if(L==='ar')await ctx.addInitScript(()=>{try{localStorage.setItem('anyware_language','ar');}catch(e){}});
for(const kv of process.env.RULES.split(',')){const [k,id]=kv.split(':');
 await page.goto(H+'/settings/automation/workflow-rules/'+id,{waitUntil:'commit'});await page.getByText('QA RT20 W2').first().waitFor({timeout:120000}).catch(()=>{});await sleep(7000);
 R[k+'dir']=await page.evaluate(()=>document.documentElement.dir+' '+document.documentElement.lang);
 let t=(await main().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');const i=t.search(/QA RT20 W2 3057 "|"QA RT20 W2 3057/);R[k+'Fold']=t.slice(Math.max(0,i-60),i+700);
 await page.mouse.wheel(0,250);await sleep(1000);await shot(`3057-r2-${k}-${L}-folded.png`,{timeout:90000});
 // open the editor by clicking the condition summary row
 const c=main().locator('button',{hasText:/QA RT20 W2 3057 "/}).first();await c.dispatchEvent('click',{},{timeout:15000}).catch(e=>R[k+'clickErr']=String(e.message).slice(0,80));await sleep(3000);
 t=(await main().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');const j=t.search(/Which|أي|السجلات|التذاكر/);R[k+'Ed']=t.slice(Math.max(0,j),j+1500);
 R[k+'inputs']=await main().locator('input,button[role=combobox]').evaluateAll(a=>a.map(x=>(x.value||x.innerText||'').trim()).filter(Boolean).slice(0,60));
 const sel=main().getByText(/Which (Tickets|Leads|Accounts|Deals)|أي/).first();await sel.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);await shot(`3057-r2-${k}-${L}-editor.png`,{timeout:90000});
 await page.mouse.wheel(0,400);await sleep(1000);await shot(`3057-r2-${k}-${L}-editor2.png`,{timeout:90000});
}
return R;
