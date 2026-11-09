const out={};await page.setViewportSize({width:1600,height:1000});
const reqs=[];page.on('response',r=>{const u=r.url();if(/\/api\/v1\//.test(u)&&/analytic|dashboard|report/i.test(u))reqs.push(r.status()+' '+r.request().method()+' '+u.replace(/^.*\/api\/v1/,'').slice(0,90))});
await page.goto(H+'/analytics/dashboards',{waitUntil:'load',timeout:120000});await page.waitForTimeout(40000);
let t=await page.locator('body').innerText();out.dash=t.replace(/\n+/g,' | ').slice(0,1500);await page.screenshot({path:'evidence/raw/analytics-Dashboards.png'});
await page.goto(H+'/analytics/reports',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
for(const f of ['GLOBAL REPORTS','STATIC REPORTS']){try{await page.getByText(f,{exact:true}).first().click();await page.waitForTimeout(8000);t=await page.locator('body').innerText();const i=t.indexOf('Showing 1 department');out[f]=t.slice(i,i+1200).replace(/\n+/g,' | ');await page.screenshot({path:'evidence/raw/reports-'+f.split(' ')[0]+'.png'});}catch(e){out[f]=String(e.message).slice(0,100)}}
// help center languages
await page.goto(H+'/settings/channels/help-center/languages',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
t=await page.locator('body').innerText();const j=t.indexOf('Languages');out.hcLang={url:page.url(),t:t.slice(t.lastIndexOf('Languages'),t.lastIndexOf('Languages')+1200).replace(/\n+/g,' | ')};await page.screenshot({path:'evidence/raw/hc-languages.png'});
out.reqs=[...new Set(reqs)].slice(0,25);return out;
