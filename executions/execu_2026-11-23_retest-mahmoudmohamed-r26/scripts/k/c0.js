const L='841043e1-c078-41f9-8d6e-dfd61bee45c3',D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';const R={};
for(const [k,m] of [['leads',L],['deals',D]]){await page.goto(H+'/modules/'+m+'/records',{waitUntil:'commit'});await sleep(15000);R[k]=(await page.locator('main').first().innerText()).slice(0,250).replace(/\s+/g,' ');await shot('crm-'+k+'-start.png');}
return R;
