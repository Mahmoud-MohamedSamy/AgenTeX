const Q='QA RT19 NTF 2851 massupd';
const net=[];page.on('request',r=>{if(/\/api\/v1\/desk\/tickets/.test(r.url())&&r.method()!=='GET'&&!/summaries/.test(r.url()))net.push(r.method()+' '+r.url().replace(/^.*\/api\/v1/,'')+' '+(r.postData()||'').slice(0,250));});
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); if (await page.getByRole('button',{name:'Search in this view'}).count()) break; }
await sleep(2000);
if(!/Table View/.test(await text())){await page.getByRole('button',{name:/Classic View|Compact View/}).click();await sleep(1000);await page.getByText('Table View',{exact:true}).first().click();await sleep(3000);}
await page.getByRole('button',{name:'Search in this view'}).click();await sleep(1000);
await page.keyboard.type(Q);await page.keyboard.press('Enter');await sleep(6000);
const rows=page.locator('tr',{hasText:Q});const n=await rows.count();
for(let i=0;i<n;i++)await rows.nth(i).locator('input[type=checkbox]').check({force:true});
await sleep(1500);
const btns=await page.locator('button:visible').evaluateAll(es=>es.map(e=>(e.getAttribute('aria-label')||e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean));
await page.getByRole("button",{name:"Update",exact:true}).click();await sleep(2500);let step=[];
await shot('2851-5-update-dialog.png');
const dlg=(await page.locator("[role=dialog]").last().innerText().catch(()=>"")).replace(/s+/g," ").slice(0,800);const ctl=await page.locator("[role=dialog] select, [role=dialog] [role=combobox], [role=dialog] button").evaluateAll(es=>es.map(e=>e.tagName+" "+(e.getAttribute("aria-label")||"")+" "+(e.innerText||"").replace(/s+/g," ").slice(0,60)));
await page.getByRole("button",{name:"Choose a field"}).click();await sleep(1200);const opts=await page.locator("[role=option], [role=menuitem], [role=listbox] *").evaluateAll(es=>es.map(e=>(e.innerText||"").trim()).filter(Boolean).slice(0,60));let o2=null;const so=page.getByRole("option",{name:"Status",exact:true});if(await so.count()){await so.click();await sleep(1500);o2=await page.locator("[role=dialog] button, [role=dialog] select, [role=dialog] input").evaluateAll(es=>es.map(e=>e.tagName+" "+(e.getAttribute("aria-label")||e.getAttribute("placeholder")||"")+" "+(e.innerText||e.value||"").replace(/s+/g," ").slice(0,40)));}
if(process.env.GO==="1"){const v=page.locator("[role=dialog]").getByRole("button",{name:/Choose a value|Select|Status value|--/}).first();if(await v.count()){await v.click();await sleep(1000);}else{const s=page.locator("[role=dialog] select").first();if(await s.count())await s.selectOption({label:"Closed"});}
const c=page.getByRole("option",{name:"Closed",exact:true});if(await c.count()){await c.click();await sleep(800);}await shot("2851-6-update-status-closed.png");await page.getByRole("button",{name:/Update record/}).click();await sleep(2500);const cf=page.getByRole("button",{name:/^(Update|Confirm|Yes)/}).last();await shot("2851-7-update-confirm.png");o2=[o2,(await text()).replace(/s+/g," ").match(/Update d+ records?.{0,200}/)?.[0]];if(await page.getByRole("alertdialog").count()){await page.getByRole("alertdialog").getByRole("button").last().click();}await sleep(8000);await shot("2851-8-update-after.png");}
await shot("2851-5b-field.png");return {n,dlg:dlg.slice(0,80),opts,o2,net};
