const o={};const S='../screenshots/';await page.setViewportSize({width:1600,height:1000});
const txt=async()=> (await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/channels/web-forms',{waitUntil:'commit',timeout:180000});for(let i=0;i<60;i++){await page.waitForTimeout(3000);if(/QA AS6 D14 form/.test(await txt()))break;}
const btns=page.getByText('Embed code',{exact:true});const n=await btns.count();o.n=n;let idx=-1;
for(let i=0;i<n;i++){const t=await btns.nth(i).evaluate(e=>{let p=e;for(let k=0;k<6&&p;k++){p=p.parentElement;if(p&&/QA AS6 D14 form|test|Webform/.test(p.innerText||''))return p.innerText.slice(0,80);}return '';});if(/QA AS6 D14/.test(t)&&!/Webform|\btest\b/.test(t)){idx=i;}o['b'+i]=t.replace(/\s+/g,' ');}
o.idx=idx;if(idx>=0){await btns.nth(idx).click({timeout:15000});await page.waitForTimeout(5000);
o.code=await page.$$eval('textarea,pre,code,input[readonly]',e=>e.map(x=>(x.value||x.innerText||'').slice(0,900)));
o.dlg=(await page.locator('[role=dialog]').first().innerText().catch(()=>'')).slice(0,1500);await page.screenshot({path:S+'ev-D14-webform-embed.png'});}
return o;
