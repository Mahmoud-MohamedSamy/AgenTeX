const wiz=async(name)=>{
await page.goto(H+'/settings/automation/workflow-rules',{waitUntil:'domcontentloaded'});
await page.getByRole('row').nth(2).waitFor({timeout:90000}).catch(()=>{});await sleep(2000);
await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('workflow-rule-draft')).forEach(k=>localStorage.removeItem(k)));
await page.getByRole('button',{name:'New Rule'}).click();const dlg=page.getByRole('dialog').first();await dlg.waitFor();
await dlg.getByRole('button',{name:'Select a module'}).click();await page.getByRole('option',{name:'Tickets'}).click();
await dlg.getByText('Selected departments').click();await sleep(500);await dlg.getByText('QA RT19 WF Dept',{exact:true}).click();await sleep(300);
await dlg.getByPlaceholder('e.g. High-Value Lead Notification').fill(name);
await dlg.getByRole('button',{name:'Next'}).click();await sleep(1000);
await dlg.getByRole('group').getByRole('button',{name:'Create',exact:true}).click().catch(e=>log('trig err',String(e.message).slice(0,100)));
await dlg.getByRole('button',{name:'Create',exact:true}).last().click();await sleep(4000);
};
const main=page.locator('main').last();const clk=l=>l.dispatchEvent('click');
const caught=[];await page.route('**/api/v1/workflow/rules',async r=>{if(r.request().method()==='POST'){caught.push(r.request().postData());await r.abort();}else await r.continue();});
await wiz('QA RT19 WF 2997 ui probe');
await clk(main.getByRole('button',{name:'Add action'}).first());await sleep(600);
await main.getByRole('button',{name:/^Owner Assignment/}).first().click();await sleep(1500);
await main.getByRole('button',{name:'Roles',exact:true}).or(main.getByRole('tab',{name:'Roles'})).first().click();await sleep(1200);
await shot('2997-1-roles-tab.png');
const combos=main.getByRole('combobox');log('combos',await combos.count());
const sel=main.locator('select');log('selects',await sel.count());
if(await sel.count()){log('opts',JSON.stringify(await sel.last().evaluate(s=>[...s.options].map(o=>[o.value,o.text]))));}
else{await main.getByText('Select…',{exact:true}).last().click().catch(e=>log('noSel',String(e.message).slice(0,80)));await sleep(800);log('options',JSON.stringify(await page.getByRole('option').allInnerTexts()));await shot('2997-1b-roles-open.png');
 const ceo=page.getByRole('option',{name:/CEO/}).first();if(await ceo.count()){await ceo.click();await sleep(800);}}
const sec=(await main.innerText()).replace(/\s+/g,' ');const i=sec.indexOf('ASSIGN OWNER TO');log('sec',sec.slice(i,i+500));
await page.getByRole('button',{name:'Save & Activate'}).click();await sleep(3000);
log('caught',caught.map(c=>{try{const j=JSON.parse(c);return JSON.stringify({deps:j.departmentIds,act:j.actions});}catch(e){return c.slice(0,500);}}));
await shot('2997-1c-after-save.png');
return {};
