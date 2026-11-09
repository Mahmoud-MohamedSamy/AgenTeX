const out={};await page.setViewportSize({width:1600,height:1000});
const reqs=[];page.on('response',r=>{const u=r.url();if(/\/api\/v1\//.test(u)&&/ai|triage|translat|predict/i.test(u))reqs.push(r.status()+' '+r.request().method()+' '+u.replace(/^.*\/api\/v1/,''))});
await page.goto(H+'/views/all/tickets/617328b7-0b3c-4230-be13-1437c609d88b',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
await page.locator('button[aria-label*="AI" i], [title*="AI" i]').first().click();await page.waitForTimeout(2500);
try{await page.getByRole('button',{name:/Suggest triage/i}).click();await page.waitForTimeout(25000);}catch(e){out.trErr=String(e.message).slice(0,120)}
let t=await page.locator('body').innerText();let i=t.indexOf('Triage suggestion');out.triage=t.slice(i,i+500).replace(/\n+/g,' | ');
await page.screenshot({path:'evidence/raw/ai-triage.png'});
out.translate=/translat/i.test(t);
// ticket ⋮ menu (top right)
const btns=page.locator('main button:has(svg)');
// help center settings
const visit=async(label,key,n=0)=>{try{await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(6000);await page.getByText(label,{exact:true}).nth(n).click();await page.waitForTimeout(9000);t=await page.locator('body').innerText();out[key]={url:page.url(),t:t.slice(t.lastIndexOf('Email Providers')+15).replace(/\n+/g,' | ').slice(0,1500)};await page.screenshot({path:'evidence/raw/set-'+key+'.png'});}catch(e){out[key]={err:String(e.message).slice(0,150)}}};
await visit('Help Center','hc');await visit('Actions','actions');await visit('Company','company');
// analytics
await page.goto(H+'/analytics',{waitUntil:'load',timeout:120000});await page.waitForTimeout(9000);
for(const tab of ['Dashboards','Reports']){try{await page.getByText(tab,{exact:true}).first().click();await page.waitForTimeout(8000);t=await page.locator('body').innerText();out['an_'+tab]={url:page.url(),t:t.replace(/\n+/g,' | ').slice(0,1200)};await page.screenshot({path:'evidence/raw/analytics-'+tab+'.png'});}catch(e){out['an_'+tab]={err:String(e.message).slice(0,100)}}}
out.reqs=reqs;return out;
