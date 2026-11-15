await page.goto(H+'/reports',{waitUntil:'domcontentloaded'}); for(let i=0;i<20;i++){ await sleep(2000); if(/QA RT18 2917/.test(await text())) break; }
const ln=page.getByText('QA RT18 2917 Gold report').first(); log('link',await ln.count()); await ln.click(); for(let i=0;i<40;i++){ await sleep(2000); if(/2917 Silver/.test(await text())&&!/Running query/.test(await text())) break; } await sleep(3000);
const t=await text(); await shot('2917-1-report-ui.png');
const k=t.indexOf('2917 Gold'); return {url:page.url().slice(-60), starCount:t.split('Silver Star').length-1, silverOnly:(t.match(/Silver(?! Star)/g)||[]).length, excerpt:t.slice(Math.max(0,k-500),k+300).replace(/\s+/g,' ')};
