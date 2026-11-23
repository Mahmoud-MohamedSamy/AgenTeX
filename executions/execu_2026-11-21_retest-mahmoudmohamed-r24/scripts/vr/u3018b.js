const MID='841043e1-c078-41f9-8d6e-dfd61bee45c3'; const ID=JSON.parse(require('fs').readFileSync('vr/ids.json','utf8')).L18; const R={};
await page.goto(H+'/modules/'+MID+'/records/'+ID,{waitUntil:'domcontentloaded'}); await page.getByText('QA RT20 VR 3018 edit').first().waitFor({timeout:90000}).catch(()=>{}); await sleep(3000);
R.buttons=(await page.getByRole('button').allInnerTexts()).map(s=>s.trim()).filter(Boolean).slice(0,40);
const eb=page.getByRole('button',{name:/^Edit$/}).first(); R.hasEdit=await eb.count(); if(R.hasEdit){ await eb.click(); await sleep(3000);} R.url=page.url();
const w=page.locator('[data-rule-field="qa_rt18v_text"] input').first(); R.hasField=await w.count();
if(R.hasField){ await w.scrollIntoViewIfNeeded(); await w.fill('BAD-edit'); await page.locator('[data-rule-field="last_name"] input').first().focus().catch(()=>{});
 await page.evaluate(()=>{window.__liv=[]; new MutationObserver(ms=>{for(const m of ms)for(const a of m.addedNodes){if(a.nodeType===1){let n=a;while(n&&n.nodeType===1){const r=n.getAttribute('role'),l=n.getAttribute('aria-live');if(r==='alert'||r==='status'||(l&&l!=='off')){window.__liv.push((r||'')+'/'+(l||'')+' :: '+a.innerText.trim().slice(0,90));break;}n=n.parentElement;}}}}).observe(document.body,{subtree:true,childList:true});});
 const reqs=[]; page.on('response',r=>{if(/\/records\//.test(r.url())&&['PATCH','PUT'].includes(r.request().method()))reqs.push(r.request().method()+' '+r.status());});
 await page.getByRole('button',{name:/^Save$/}).last().click(); await sleep(4000); R.reqs=reqs;
 R.a=await page.evaluate(()=>{const i=document.querySelector('[data-rule-field="qa_rt18v_text"] input');const db=i.getAttribute('aria-describedby');const e=db&&document.getElementById(db.split(' ')[0]);return{ariaInvalid:i.getAttribute('aria-invalid'),describedby:!!db,msg:e&&(e.innerText.trim()+' [role='+e.getAttribute('role')+']'),focusedIsInput:document.activeElement===i,focused:(document.activeElement.closest('[data-rule-field]')||{getAttribute:()=>document.activeElement.tagName}).getAttribute('data-rule-field'),live:window.__liv};});
 R.aria=await page.locator('[data-rule-field="qa_rt18v_text"]').ariaSnapshot().catch(e=>'err');
 R.box=await page.locator('[data-rule-field="qa_rt18v_text"]').boundingBox();
 await shot('3018-3-crm-edit-refused.png'); }
else { await shot('3018-3-crm-edit-nofield.png'); R.body=(await text()).slice(0,800); }
return R;
