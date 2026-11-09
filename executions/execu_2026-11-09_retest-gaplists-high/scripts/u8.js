const D2='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2392/shots/';
const D7='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/ndc-2417/shots/';
const C='https://staging-crm.taviportal.com';
await page.setViewportSize({width:1600,height:1000});
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();if(['GET','HEAD','OPTIONS'].includes(m))return r.continue();const u=r.request().url();if(u.includes('/iam/auth/'))return r.continue();if(m==='POST'&&/realtime|heartbeat|resolved-batch|query|search|classify|mentionable|summaries|lookups\/resolve|stats|for-record/.test(u))return r.continue();out.blocked.push(m+' '+u.split('/api/v1')[1]);return r.abort();});
const go=async(u,w=4000)=>{await page.goto(u,{waitUntil:'load',timeout:120000}).catch(()=>{});for(let i=0;i<60;i++){const l=(await page.locator('body').innerText().catch(()=>'')).length;if(l>400)break;await page.waitForTimeout(1500);}await page.waitForTimeout(w);};
// subordinates of a real user
const me=(await api('GET','/iam/me')).j.data.user_id;for(const p of ['/iam/users/'+me+'/subordinates','/iam/users/'+me]){out[p.replace(me,'{owner}')]=(await api('GET',p)).s;}
// 2417 hierarchy page
await go(C+'/settings/company/hierarchy-preference',6000);await page.screenshot({path:D7+'t01-hierarchy-page.png',fullPage:true});
out.hier=(await page.locator('main').innerText().catch(()=>'')).slice(0,1500);
await go(C+'/settings/personal/reporting-hierarchy',4000);out.personalUrl=page.url();
await go(C+'/settings/general/users',6000);await page.screenshot({path:D7+'t02-users-list.png'});
out.usersHeader=(await page.locator('thead').innerText().catch(()=>'')).slice(0,400);
return out;
