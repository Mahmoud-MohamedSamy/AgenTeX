for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/settings/global-picklist',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('goto retry',String(e.message).slice(0,80));} } await sleep(25000);
log('url',page.url().slice(0,120)); log((await text()).slice(0,2000)); await shot('zoho-2870-1-list.png');
const r=await zapi('GET','/crm/v8/settings/global_picklists'); log('api',r.s,r.t.slice(0,1500));
return {};
