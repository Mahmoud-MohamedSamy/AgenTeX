const main=()=>page.locator('main').last();const R={};
await page.goto(H+'/settings/automation/workflow-rules/b3f7f4a3-def6-4cf3-8f33-53db39e40be7',{waitUntil:'domcontentloaded'});
await page.getByText('CONDITION').first().waitFor({timeout:60000}).catch(()=>{});await sleep(5000);
// open the condition editor: click folded summary
const sum=main().locator('button',{hasText:'Priority'}).first();await sum.dispatchEvent('click');await sleep(2500);
const t=(await main().innerText()).replace(/\s+/g,' ');R.ed=t.slice(t.indexOf('Which Tickets'),t.indexOf('Which Tickets')+300);
R.chips=await main().evaluate(()=>{const out=[];document.querySelectorAll('main [class*=chip], main [class*=badge], main [class*=tag]').forEach(e=>{const s=(e.innerText||"").trim();if(s&&s.length<40)out.push(s);});return [...new Set(out)].slice(0,40);});
const pr=main().getByText('Priority',{exact:true}).last();await pr.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);await shot('3057-2-editor-priority.png');
const lg=main().getByText('Language',{exact:true}).last();await lg.scrollIntoViewIfNeeded().catch(()=>{});await sleep(800);await shot('3057-3-editor-language.png');
// ticket page
await page.goto(H+'/views/all/tickets/f3ee35f3-ff2f-4cd2-a750-ce80e54825b7',{waitUntil:'domcontentloaded'});await sleep(12000);
const tt=(await page.locator('body').innerText()).replace(/\s+/g,' ');const j=tt.indexOf('Priority');R.ticket=tt.slice(j-50,j+200);
await shot('3057-4-ticket-priority.png');
return R;
