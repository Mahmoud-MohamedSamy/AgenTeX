for(let i=0;i<3;i++){ try{ await page.goto('https://crm.zoho.com/crm/org946877290/settings/modules',{waitUntil:'commit',timeout:120000}); break;}catch(e){log('retry');} }
for(let k=0;k<20;k++){ await sleep(3000); if(/Global Sets/i.test(await text())) break; }
const ok=await page.evaluate(()=>{const els=[...document.querySelectorAll('a,button,span,div,li')].filter(e=>e.children.length===0&&/^\s*Global Sets\s*$/i.test(e.textContent)&&e.offsetParent); if(els[0]){els[0].click(); return els.length;} return 0;}); log('clicked',ok);
for(let k=0;k<15;k++){ await sleep(3000); if(/QA RT19 GS Zsort/.test(await text())) break; }
await sleep(3000); log('url',page.url()); const t=await text(); log(t.slice(t.indexOf('Global Set')).slice(0,1500)); await shot('zoho-2870-1-list.png');
return {};
