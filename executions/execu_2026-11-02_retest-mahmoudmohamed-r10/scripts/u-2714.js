const N=process.env.N||'1'; const NAME='QA RT r10 2714 imp'+N; const st={};
const txt=()=>text(); const wait=async(re,s=90)=>{for(let i=0;i<s/2;i++){if(re.test(await txt()))return true; await sleep(2000);}return false;};
await page.goto(H+'/modules/'+T.LEADS+'/import',{waitUntil:'commit',timeout:120000});
for(let i=0;i<60 && !(await page.locator('input[type=file]').count());i++){ const so=page.getByRole('button',{name:'Start over'}); if(await so.count()){await so.click();} await sleep(2000);}
await shot('2714-'+N+'-start.png'); await page.locator('input[type=file]').setInputFiles({name:`qa-r10-2714-${N}.csv`,mimeType:'text/csv',buffer:Buffer.from(`First Name,Last Name,Phone,Email\n${NAME},${NAME},010027140${N},qa.r10.2714.${N}@example.com\n`)});
await sleep(4000); await page.getByRole('button',{name:'Next'}).click(); await sleep(6000);
await page.locator('select').first().selectOption({label:'Standard'}).catch(()=>{}); await sleep(600);
await page.getByText('Add new records',{exact:true}).click().catch(()=>{}); await sleep(1000);
await page.getByRole('button',{name:'Next'}).click(); await sleep(7000);
await page.getByRole('button',{name:'Next'}).click(); await sleep(7000);
await shot(`2714-${N}-assign-before.png`);
st.assignText=(await txt()).split('Assign').slice(1).join(' ').slice(0,700).replace(/\s+/g,' ');
const cb=page.getByLabel(/Assign owner based on assignment rules/i); if(await cb.count()) await cb.check(); else await page.getByText(/Assign owner based on assignment rules/i).click();
await sleep(2000);
const sels=page.locator('select'); st.selects=[]; for(let i=0;i<await sels.count();i++){ st.selects.push(await sels.nth(i).evaluate(x=>[...x.options].map(o=>o.text).join(' | ').slice(0,300))); }
for(let i=0;i<await sels.count();i++){ const has=await sels.nth(i).evaluate(x=>[...x.options].some(o=>o.text.includes('QA RT r10 2714 AR'))); if(has){ await sels.nth(i).selectOption({label:'QA RT r10 2714 AR'}); st.chose=i; } }
if(st.chose===undefined){ await page.getByText('Choose assignment rule').first().click(); await sleep(2000); st.opts=(await txt()).match(/Choose assignment rule.{0,600}/s)?.[0].replace(/s+/g,' '); const o=page.getByRole('option',{name:/QA RT r10 2714 AR/}); if(await o.count()) await o.first().click(); else await page.getByText('QA RT r10 2714 AR',{exact:false}).last().click(); }
await sleep(1500); await shot(`2714-${N}-assign.png`);
await page.getByRole('button',{name:'Save & next'}).click(); await sleep(8000);
await page.getByText('I confirm I have permission',{exact:false}).click().catch(()=>{}); await sleep(600);
await shot(`2714-${N}-review.png`);
await page.getByRole('button',{name:'Submit'}).click();
await wait(/Import complete|Import finished|completed with errors|Import failed|added/i,120);
await sleep(3000); await shot(`2714-${N}-result.png`);
st.result=(await txt()).match(/(Import complete|Import finished|completed).{0,300}/s)?.[0].replace(/\s+/g,' ');
return st;
