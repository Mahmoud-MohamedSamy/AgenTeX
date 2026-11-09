const out={};await page.setViewportSize({width:1600,height:1000});
const grab=async(key,from)=>{const t=await page.locator('body').innerText();const i=from?t.lastIndexOf(from):-1;out[key]={url:page.url(),t:(i>0?t.slice(i):t).replace(/\n+/g,' | ').slice(0,1600)};await page.screenshot({path:'evidence/raw/p-'+key+'.png'});};
for(const [u,k] of [['/chat','chat'],['/social','social'],['/im','im']]){try{await page.goto(H+u,{waitUntil:'load',timeout:120000});await page.waitForTimeout(14000);await grab(k)}catch(e){out[k]={err:String(e.message).slice(0,100)}}}
const ts=await api('GET','/desk/tab-settings');out.tabs=ts.t.slice(0,1500);
try{await page.goto(H+'/settings/users-control/ticket-access',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);await page.getByRole('tab',{name:/Agent availability/i}).first().click();await page.waitForTimeout(6000);await grab('avail','Agent availability')}catch(e){out.avail={err:String(e.message).slice(0,100)}}
return out;
