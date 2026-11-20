const R={};const bt=async()=>(await page.locator('body').innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/records/new',{waitUntil:'commit'});await sleep(10000);let t=await bt();
R.hasCurrency=/Currency/.test(t);R.hasRate=/Exchange Rate/i.test(t);const k=t.indexOf('Amount');R.amount=t.slice(Math.max(0,k-40),k+120);await shot('crm-3107-a-create-deal.png',{timeout:90000,fullPage:true});
const cl=page.getByText(/^Currency$/).first();if(await cl.count()){await cl.scrollIntoViewIfNeeded();const b=cl.locator('xpath=following::button[1]');await b.click().catch(()=>{});await sleep(1200);R.currencyOptions=(await page.locator('[role=option]').allInnerTexts()).map(s=>s.trim()).slice(0,12);await shot('crm-3106-a-currency-options.png',{timeout:90000});await page.keyboard.press('Escape');}
return R;
