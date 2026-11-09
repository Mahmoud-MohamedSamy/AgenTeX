eval(require('fs').readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-backlog/scripts/lib.js','utf8'));
const SS=RUN+'/screenshots/';const o={};await page.setViewportSize({width:1600,height:900});
const t={id:(IDS.tickets||[]).slice(-1)[0]};o.t=t.id;
await page.goto(H+'/views/all/tickets/'+t.id,{waitUntil:'domcontentloaded',timeout:120000});
await page.getByText(/QA RT9 2174 D screen/).first().waitFor({timeout:150000}).catch(e=>o.w=e.message.slice(0,80));await sleep(5000);
o.url=page.url();await page.screenshot({path:SS+'u30-ticket.png'});
const cand=page.locator('button,[role=combobox]').filter({hasText:/^\s*Open\s*$/});o.nOpen=await cand.count();
if(o.nOpen){await cand.first().click();await sleep(2500);
 o.opts=await page.locator('[role=option],[role=menuitem],[role=menuitemradio]').allInnerTexts();
 await page.screenshot({path:SS+'2174-10g-ticket-status-dropdown.png'});await page.keyboard.press('Escape');}
return o;
