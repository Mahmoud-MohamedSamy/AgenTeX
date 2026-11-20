const R={};const main=()=>page.locator('main').last();
const waitTxt=async(re,ms=60000)=>{const t0=Date.now();while(Date.now()-t0<ms){const t=await page.innerText('body').catch(()=>'');if(re.test(t))return true;await sleep(1500);}return false;};
await page.goto(H+'/settings/workflow-executions',{waitUntil:'domcontentloaded'});R.listLoaded=await waitTxt(/Fired|Skipped|No executions|Outcome/i,90000);await sleep(2000);
R.listTop=(await page.innerText('body')).replace(/\s+/g,' ').slice(0,1500);
R.selects=await page.evaluate(()=>[...document.querySelectorAll('select')].map(s=>[...s.options].map(o=>o.text)));
R.combos=await page.evaluate(()=>[...document.querySelectorAll('[role=combobox],button[aria-haspopup]')].map(b=>(b.getAttribute('aria-label')||'')+':'+b.innerText.trim()).slice(0,30));
await shot('3052-0-exec-list.png');
for(const [n,id] of Object.entries({'3052-2-exec-withcontact1':'a9aeba58-adf9-47cc-911a-bba717e389ff','3052-6-exec-sysfill':'c3914166-eb77-43e8-8619-f402cbec7d86','3052-6b-exec-sysstatus':'41dd5333-6ff5-4822-96f8-e61d6881273c'})){await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'domcontentloaded'});await waitTxt(/Dispatched actions/,60000);await sleep(1500);const t=(await page.innerText('body')).replace(/\s+/g,' ');const i=t.indexOf('Back to history');R[n]=(i>=0?t.slice(i,i+700):t.slice(-300));await shot(n+'.png');}
return R;
