const D2='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
const D7='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2417/shots/';
const C='https://staging-crm.taviportal.com';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(u.includes('/iam/auth/'))return r.continue();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable|summaries|lookups\/resolve|stats|for-record/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
// users list -> open a test user's modal (valafo4080 / test user 1)
await go(C+'/settings/general/users',6000);
const row=page.locator('tr',{hasText:/test user 1|Test User 1/i}).first();
await row.click().catch(e=>out.e1=e.message);await page.waitForTimeout(4000);
const dlg=page.locator('[role=dialog]').first();
const sel=dlg.locator('select',{has:page.locator('option',{hasText:'No manager'})}).first();
out.mgrOptions=await sel.evaluate(s=>[...s.options].map(o=>o.text)).catch(e=>'ERR '+e.message);
await sel.scrollIntoViewIfNeeded().catch(()=>{});
await page.screenshot({path:D7+'t03-user-modal.png'});
out.optCount=Array.isArray(out.mgrOptions)?out.mgrOptions.length:0;
await page.keyboard.press('Escape');
// CRM contact page with Desk Tickets card
await go(C+'/modules/6f553963-01d6-4b68-9fb3-143d23044c41/records/9981898d-590f-4dac-9e92-efeceb881770',8000);
const card=page.getByText(/Desk Tickets|Tickets/).first();await card.scrollIntoViewIfNeeded().catch(()=>{});await page.waitForTimeout(2000);
await page.screenshot({path:D2+'c01-crm-contact-tickets.png'});
out.filters=await page.locator('[aria-label="Ticket status filter"]').innerText().catch(()=>'n/a');
return out;
