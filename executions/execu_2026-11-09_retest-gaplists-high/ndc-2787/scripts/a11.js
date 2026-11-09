const out={};await page.setViewportSize({width:1600,height:1000});
const grab=async(key)=>{const t=await page.locator('body').innerText();const i=t.lastIndexOf('Email Providers');out[key]={url:page.url(),t:(i>0?t.slice(i+15):t).replace(/\n+/g,' | ').slice(0,1800)};await page.screenshot({path:'evidence/raw/p-'+key+'.png'});};
const go=async(u,key,w=10000)=>{try{await page.goto(H+u,{waitUntil:'load',timeout:120000});await page.waitForTimeout(w);await grab(key)}catch(e){out[key]={err:String(e.message).slice(0,100)}}};
await go('/settings','x',5000);
for(const [l,k] of [['Capabilities','caps'],['Ticket Access','access'],['Languages','hclang']]){try{await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await page.waitForTimeout(5000);if(k==='hclang'){await page.getByText('Help Center',{exact:true}).first().click();await page.waitForTimeout(8000);}await page.getByText(l,{exact:true}).first().click();await page.waitForTimeout(9000);await grab(k)}catch(e){out[k]={err:String(e.message).slice(0,100)}}}
await go('/settings/channels/email/replies','replies');
// RR preferences
try{await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);await page.getByText('Team Assignment',{exact:true}).first().click();await page.waitForTimeout(8000);await grab('teamassign');}catch(e){out.teamassign={err:String(e.message).slice(0,100)}}
return out;
