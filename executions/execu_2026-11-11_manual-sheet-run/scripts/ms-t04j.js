// T-04-07 after a fresh sign-in: search the ticket number in the list search, open it, compare values.
const L=require('./lib');
module.exports=async()=>{const R={};const id='2a652794-99be-4720-b805-4c54f91cfd5f';
 await pg.setViewportSize({width:1600,height:1000});await pg.goto(H+'/views/all/tickets',{waitUntil:'commit'}).catch(()=>{});await pg.waitForFunction(()=>document.body.innerText.includes('New Ticket'),null,{timeout:120000}).catch(()=>{});
 const s=pg.locator('input[type=search], input[placeholder*="Search" i]').filter({hasNot:pg.locator('[readonly]')});R.searchBoxes=await s.count();
 for(let i=0;i<R.searchBoxes;i++){const b=s.nth(i);if(await b.isVisible()&&!/jump/i.test(await b.getAttribute('placeholder')||'')){await b.fill('2870');await pg.keyboard.press('Enter');await pg.waitForTimeout(5000);break;}}
 R.listHit=/QA MAN phone 01/.test(await L.body_txt());await L.shot('t04-07-search');
 await L.gotoTicket(id);const t=await L.body_txt();R.vals={subject:t.includes('QA MAN phone 01'),desc:t.includes('Caller asks about refund'),phone:/Phone/.test(t),mk:/Marketing/.test(t),contact:t.includes('QA MAN Contact 1'),open:/Open/.test(t)};await L.shot('t04-07-after-signin');return R;};
