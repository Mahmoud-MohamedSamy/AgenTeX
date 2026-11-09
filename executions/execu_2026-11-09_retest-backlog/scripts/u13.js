const SS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/screenshots/';
const o={};await page.setViewportSize({width:1600,height:900});
const writes=[];page.on('request',r=>{if(/api\/v1/.test(r.url())&&!['GET','OPTIONS'].includes(r.method())&&!/heartbeat|resolved-batch|iam\/auth|realtime/.test(r.url()))writes.push(r.method()+' '+r.url().replace(/.*api\/v1/,''));});
await page.goto(H+'/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d/layouts/0dabc9a3-c7f2-4f74-bd1b-9e21373a6c06',{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText('Case Information',{exact:true}).waitFor({timeout:200000});await sleep(4000);
const dlgText=async()=>page.evaluate(()=>{const h=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&e.textContent.trim()==='Field Properties');let d=h;for(let i=0;i<8&&d;i++){d=d.parentElement;if(d&&d.textContent.includes('Apply')&&d.textContent.includes('ADVANCED'))break;}
 if(!d)return '';const ctr=[...d.querySelectorAll('input,select,textarea,[role=switch],[role=checkbox]')].map(x=>'['+(x.type||x.getAttribute('role'))+':'+(x.getAttribute('aria-label')||x.name||x.placeholder||'')+'='+(x.type==='checkbox'||x.getAttribute('role')?(x.checked??x.getAttribute('aria-checked')):String(x.value).slice(0,40))+']');return d.innerText.replace(/The (API name|data type)[^\n]*/g,'')+'\nCTRL '+ctr.join(' ');});
const props=async(label,tag,exact=true)=>{const r={};try{const l=page.getByText(label,{exact}).first();await l.scrollIntoViewIfNeeded({timeout:15000});await l.hover();await sleep(800);
 await l.locator('xpath=ancestor::*[.//button][1]').getByRole('button',{name:'Field options'}).click();await sleep(1500);
 await page.getByText('Edit Properties',{exact:true}).last().click();await sleep(3500);
 for(const tab of ['GENERAL','VALIDATION','ADVANCED']){await page.getByText(tab,{exact:true}).last().click().catch(()=>{});await sleep(1500);r[tab]=(await dlgText()).slice(0,1800);await page.screenshot({path:SS+'2174-'+tag+'-'+tab.toLowerCase()+'.png'});}
 const c=page.getByRole('button',{name:/^Cancel$/}).last();await c.click({timeout:5000}).catch(()=>page.keyboard.press('Escape'));await sleep(1500);
 }catch(e){r.e=e.message.slice(0,160);await page.keyboard.press('Escape').catch(()=>{});}return r;};
o.lookup=await props('Contact','lookup');
o.pick=await props('Language','picklist');
o.number=await props('QA NDC Number of assigned','number',false);
o.writes=writes;
return o;
