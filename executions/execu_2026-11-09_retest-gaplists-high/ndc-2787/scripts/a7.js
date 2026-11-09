const out={};await page.setViewportSize({width:1600,height:1000});
const reqs=[];page.on('response',r=>{const u=r.url();if(/\/api\/v1\//.test(u)&&/ai|summar|triage|translat|assist/i.test(u))reqs.push(r.status()+' '+r.request().method()+' '+u.replace(/^.*\/api\/v1/,''))});
await page.goto(H+'/views/all/tickets/617328b7-0b3c-4230-be13-1437c609d88b',{waitUntil:'load',timeout:120000});await page.waitForTimeout(12000);
await page.screenshot({path:'evidence/raw/ticket.png'});
// rail: find AI assist
const rail=page.locator('button[aria-label*="AI" i], [title*="AI" i]');out.railN=await rail.count();
if(out.railN) await rail.first().click(); else await page.mouse.click(313,286);
await page.waitForTimeout(3000);
try{await page.getByRole('button',{name:/Summarize ticket/i}).click();await page.waitForTimeout(25000);}catch(e){out.sumErr=String(e.message).slice(0,120)}
let t=await page.locator('body').innerText();const i=t.indexOf('AI assist');out.ai=i>=0?t.slice(i,i+800).replace(/\n+/g,' | '):'no AI assist panel';
await page.screenshot({path:'evidence/raw/ai-summary.png'});
// more menu
try{await page.locator('button[aria-label*="more" i]').first().click();await page.waitForTimeout(2500);out.more=(await page.locator('[role=menu]').first().innerText()).replace(/\n+/g,' | ');await page.screenshot({path:'evidence/raw/ticket-more.png'});await page.keyboard.press('Escape');}catch(e){out.moreErr=String(e.message).slice(0,120)}
out.tabs=(await page.locator('[role=tab]').allInnerTexts()).join(' | ');
out.reqs=reqs;
return out;
