const D2='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
const C='https://staging-crm.taviportal.com';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(u.includes('/iam/auth/'))return r.continue();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable|summaries|lookups\/resolve|stats|for-record/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
await go(C+'/modules/6f553963-01d6-4b68-9fb3-143d23044c41/records/9981898d-590f-4dac-9e92-efeceb881770',6000);
await page.getByRole('tab',{name:'Desk'}).first().click().catch(async()=>{await page.getByText('Desk',{exact:true}).nth(1).click().catch(e=>out.e1=e.message)});
await page.waitForTimeout(7000);await page.screenshot({path:D2+'c01-crm-contact-tickets.png'});
out.filters=await page.locator('[aria-label="Ticket status filter"]').innerText().catch(()=>'n/a');
// CRM integration settings page
await go(C+'/settings',5000);await page.getByText('CRM ⇄ Desk Integration').first().click().catch(e=>out.e2=e.message);await page.waitForTimeout(7000);
out.intUrl=page.url();await page.screenshot({path:D2+'c02-crm-integration-page.png'});
out.intText=(await page.locator('main').innerText().catch(()=>'')).split('\n').filter(l=>l.trim()).slice(-40);
return out;
