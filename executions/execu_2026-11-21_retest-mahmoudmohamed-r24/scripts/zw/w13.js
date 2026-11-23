const fs=require('fs');
module.exports=async(page)=>{const R={muts:[]};const RAW='../screenshots/raw/';
page.on('request',q=>{if(!['GET','OPTIONS'].includes(q.method())&&/desk\.zoho\.com\/support/.test(q.url())&&!/getbadge|getresource/.test(q.url()))R.muts.push(q.method()+' '+q.url().replace(/^https:\/\/[^/]+/,'').replace(/\?.*/,'').slice(0,90));});
const findF=async(re,ms)=>{for(let w=0;w<ms/1500;w++){for(const f of page.frames()){if(await f.getByText(re).count().catch(()=>0))return f;}await page.waitForTimeout(1500);}return null;};
await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup',{waitUntil:'commit',timeout:90000});await page.waitForTimeout(15000);
await page.getByText('Not Now').first().click().catch(()=>{});
await page.getByText(/^Feedback Widget$/).first().click({timeout:20000}).catch(async()=>{await page.getByText(/^Web Forms?$/).first().click();await page.waitForTimeout(3000);await page.getByText(/^Feedback Widget$/).first().click();});
await page.waitForTimeout(5000);if(!(await findF(/Create Feedback Widget|Feedback Widget Code|Select Department/,45000))){await page.reload({waitUntil:'commit',timeout:90000});await page.waitForTimeout(15000);await page.getByText(/^Feedback Widget$/).first().click({timeout:20000}).catch(()=>{});}let f=await findF(/Create Feedback Widget|Feedback Widget Code|Get Code|Edit Widget/,120000);if(f){R.landing=(await f.locator('body').innerText()).replace(/s+/g,' ').split('Sign Out').pop().slice(0,500);if(/Code|Edit Widget/.test(R.landing)&&!/haven't configured/.test(R.landing)){await page.screenshot({path:RAW+'z2751-e2.png'});return R;}}if(!f){await page.screenshot({path:RAW+'z2751-e1.png'});return {err:'no create button'};}
const cb=f.getByText(/Create Feedback Widget/).first();if(await cb.count())await cb.click();else{await page.screenshot({path:RAW+'z2751-e3.png'});await page.mouse.click(928,408);}
f=await findF(/Select Department---/,40000);if(!f)return {err:'no editor'};
const sel=f.locator('select');R.sel=await sel.count();
for(let i=0;i<R.sel;i++){const o=await sel.nth(i).locator('option').allInnerTexts();if(o.some(x=>/^Tech$/.test(x.trim()))){await sel.nth(i).selectOption({label:'Tech'});R.picked=i;}}
if(R.picked===undefined){await f.getByText('Select Department---').first().click();await page.waitForTimeout(1500);const t=f.getByText('Tech',{exact:true});R.techN=await t.count();await t.last().click().catch(e=>R.selErr=e.message.slice(0,60));}
await page.waitForTimeout(1500);await page.screenshot({path:RAW+'z2751-16.png'});
const sv=f.locator('input[value="Save"], button:has-text("Save")');R.svN=await sv.count();if(R.svN)await sv.first().click().catch(async()=>{await page.mouse.click(324,841);});else await page.mouse.click(324,841);await page.waitForTimeout(12000);
let code='';for(const g of page.frames()){const ta=g.locator('textarea');for(let i=0;i<await ta.count().catch(()=>0);i++){const v=await ta.nth(i).inputValue().catch(()=>'');if(/script|iframe/i.test(v))code=v;}}
if(code){fs.writeFileSync('../out/zoho-fw-code.txt',code);R.codeLen=code.length;R.codeShape=code.replace(/[A-Za-z0-9]{20,}/g,'<id>').slice(0,300);}
const T=(await f.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');R.after=T.split('Sign Out').pop().slice(0,1200);
await page.screenshot({path:RAW+'z2751-17.png'});return R;};
