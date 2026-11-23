const R={};const main=()=>page.locator('main').last();
await page.goto(H+'/settings/workflow-executions',{waitUntil:'domcontentloaded'});await sleep(9000);
R.listTop=(await main().innerText()).replace(/\s+/g,' ').slice(0,1200);
R.selects=await page.evaluate(()=>[...document.querySelectorAll('main select')].map(s=>[...s.options].map(o=>o.text)));
R.buttons=await page.evaluate(()=>[...document.querySelectorAll('main button, main [role=combobox]')].map(b=>b.innerText.trim()).filter(Boolean).slice(0,40));
await shot('3052-0-exec-list.png');
const ex={'3052-1-exec-nocontact1':'7b8aff17-d5e1-4891-a8b0-64519bc56d3e','3052-2-exec-withcontact1':'a9aeba58-adf9-47cc-911a-bba717e389ff','3052-3-exec-nocontact2':'a4abbbac-e649-492c-b17b-1bff1d805cb1','3052-4-exec-withcontact2':'0f49ad52-400d-46cd-a96d-acf9c01427ce','3052-5-exec-custom-empty':'739cc9e6-1f6c-4cbd-833f-2cc70848e637','3052-6-exec-sysfill':'c3914166-eb77-43e8-8619-f402cbec7d86','3052-7-exec-conn-nocontact':'243e7a42-2959-401c-a7ae-ecd037241742','3052-8-exec-conn-withcontact':'08894429-4eda-4aca-a745-8d47d2aa72cf','3052-9-exec-saved-prefix':'b3624e0c-18f5-4ee3-a27f-cadf72c4c882'};
for(const [n,id] of Object.entries(ex)){await page.goto(H+'/settings/workflow-executions/'+id,{waitUntil:'domcontentloaded'});await sleep(6000);const t=(await main().innerText()).replace(/\s+/g,' ');const i=t.indexOf('Back to history');R[n]=(i>=0?t.slice(i,i+800):t.slice(-400));
 const det=page.getByText(/Not created/).first();if(await det.count()){R[n+' title']=await det.getAttribute('title').catch(()=>null);await det.hover().catch(()=>{});await sleep(800);}
 await shot(n+'.png');}
return R;
