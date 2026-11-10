const T='88e8ea44-1658-4df3-9930-d0902b91073d';
await page.route('**/api/v1/**',q=>{const m=q.request().method();if(m!=='GET'&&!/iam\/auth|heartbeat|resolved-batch|realtime/.test(q.request().url()))return q.abort();return q.continue();});
const f=arr((await api('GET','/modules/'+T+'/fields')).j);const sk=f.find(x=>/^skills?$/i.test(x.apiName||x.api_name||'')||/^skills$/i.test((x.labels&&x.labels.en)||x.label||''));
const info=sk?{id:sk.id,api:sk.apiName||sk.api_name,dt:sk.datatypeKey||sk.datatype_key,keys:Object.keys(sk).slice(0,30),opts:JSON.stringify(sk.datatypeOptions||sk.datatype_options||{}).slice(0,400),locked:JSON.stringify(sk).match(/"(is_?[a-z_]*lock[a-z_]*|readOnly|read_only|system[a-z_]*|isSystem)":[^,]+/gi)}:null;
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/settings/modules-and-fields/'+T+'?tab=fields',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);
const row=page.getByText('Skills',{exact:true}).first();let clicked=false;
if(await row.count()){await row.scrollIntoViewIfNeeded();await row.click().catch(()=>{});clicked=true;await page.waitForTimeout(3000);}
await page.screenshot({path:'../ndc-2805/evidence/raw/mf-skills-field.png'});
const dlg=await page.locator('[role=dialog]').last().innerText().catch(()=>null);
const body=(await page.locator('body').innerText());const notes=body.split('\n').filter(l=>/skill|lock|read-only|read only|cannot|can't|managed/i.test(l)).slice(0,20);
return {info,clicked,dlg:dlg&&dlg.slice(0,1500),notes};
