await page.setViewportSize({width:1600,height:1000});const o={};
const id='b1a8d3d9-2951-412e-89e7-b9e61cb6a91f';
await page.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit'});await page.waitForFunction(()=>/QA AS6 SEQ emailoff 3/.test(document.body.innerText),null,{timeout:90000}).catch(()=>{});await page.waitForTimeout(3000);
o.url=page.url();const tabs=await page.getByRole('tab').allInnerTexts();o.tabs=tabs;
const h=page.getByRole('tab',{name:/History/i});if(await h.count()){await h.first().click();await page.waitForTimeout(3000);}
const b=await page.innerText('body');const i=b.indexOf('Round Robin');o.hist=b.slice(Math.max(0,i-600),i+600);
await page.screenshot({path:'../screenshots/ev-B2-tavi-history.png'});return o;
