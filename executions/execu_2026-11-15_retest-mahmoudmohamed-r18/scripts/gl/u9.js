const KM='0924eb24-e42a-4eab-8efd-e3428f19e882';
await page.goto(H+'/modules/'+KM+'/records/new',{waitUntil:'domcontentloaded'}); await sleep(12000); for(let i=0;i<30 && /Loading form/.test(await page.locator('main').last().innerText());i++) await sleep(1000);
const inputs=await page.locator('main input, main [role=combobox], main button[aria-haspopup]').evaluateAll(es=>es.map(e=>[e.tagName,e.type,e.name,e.placeholder,e.getAttribute('aria-label'),(e.innerText||'').slice(0,30),e.id]));
await shot('3024-0-new.png');
return {inputs, t:(await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(0,1200)};
