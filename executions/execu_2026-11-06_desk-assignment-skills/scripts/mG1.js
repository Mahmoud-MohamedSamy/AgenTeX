const o={};const S='../screenshots/';await page.setViewportSize({width:1600,height:1100});
const txt=async()=> (await page.innerText('main').catch(async()=>await page.innerText('body'))).replace(/\s+/g,' ');
await page.goto(H+'/settings/data/import?module=88e8ea44-1658-4df3-9930-d0902b91073d',{waitUntil:'commit',timeout:180000});
for(let i=0;i<60;i++){await page.waitForTimeout(3000);if(/Start import/.test(await txt()))break;}
o.fileInputs=await page.locator('input[type=file]').count();
await page.locator('input[type=file]').first().setInputFiles('../evidence/d14/qa-as6-d14-import.csv');await page.waitForTimeout(4000);
o.afterFile=(await txt()).slice(-800);
await page.screenshot({path:S+'ev-D14-import-step1.png',fullPage:true});o.btns=await page.$eval('button',e=>e.map(x=>(x.innerText||'').trim()+(x.disabled?'(disabled)':'')).filter(Boolean));const st=page.getByRole('button',{name:/Start import/i}).first();try{await st.click({timeout:10000});o.clicked=true;}catch(e){o.clickErr=e.message.slice(0,200);}
for(let i=0;i<30;i++){await page.waitForTimeout(3000);const t=await txt();if(!/Start import/.test(t)||/map|Map/.test(t))break;}
await page.waitForTimeout(4000);o.step2=(await txt()).slice(0,3500);o.url=page.url();
o.controls=await page.$$eval('main select, main button, main [role=combobox], main input',e=>e.map(x=>x.tagName+'|'+(x.innerText||x.value||x.getAttribute('aria-label')||x.name||'').slice(0,40)).filter(s=>s.length>4).slice(0,60));
await page.screenshot({path:S+'ev-D14-import-step2.png',fullPage:true});return o;
