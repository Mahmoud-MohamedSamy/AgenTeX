const posts=[];page.on('request',r=>{if(/\/desk\/departments/.test(r.url())&&r.method()!=='GET')posts.push(r.method()+' '+r.url().replace(/.*api\/v1/,'')+' '+(r.postData()||'').slice(0,600));});
let newId=null;page.on('response',async r=>{if(r.request().method()==='POST'&&/\/desk\/departments$/.test(r.url())){try{const j=await r.json();newId=(j.data&&j.data.id)||j.id;}catch(e){}}});
await page.goto(H+'/settings/organization/departments',{waitUntil:'commit',timeout:120000});await wt(/New Department|Add Department/,90000);await page.waitForTimeout(3000);
await page.locator('button, a').filter({hasText:/New Department|Add Department/i}).first().click();await wt(/Department Name/);await page.waitForTimeout(2500);
{const nb=await page.locator('text=/^Department Name/').first().boundingBox();await page.mouse.click(nb.x+200,nb.y+nb.height+22);await page.keyboard.type('QA RC 1865 Dept');await page.waitForTimeout(800);}
const cb=page.getByLabel('Display in Help Center');out.helpCenterChecked=await cb.isChecked().catch(()=>null);
await shot('g2-form-before-save');
await page.locator('button:has-text("Configure Channels")').click();await page.waitForTimeout(8000);
out.step2=(await body()).split('\n').filter(l=>l.trim()).slice(-25);await shot('g3-after-configure-channels');
out.newId=newId;if(newId)log(`CREATED department ${newId} (QA RC 1865 Dept) via UI form, "Display in Help Center" checked`);
// finish wizard if a final button exists
const fin=page.locator('button').filter({hasText:/^(Save|Finish|Done|Skip|Create|Save and finish|Skip for now)$/}).last();out.finBtn=await fin.innerText().catch(()=>null);
if(out.finBtn){await fin.click();await page.waitForTimeout(6000);}
out.posts=posts;
if(newId){const g=await api('GET','/desk/departments/'+newId);const d=g.j&&(g.j.data||g.j);out.readBack={s:g.s,visibility:d&&d.visibility,help_center_display_name:d&&d.help_center_display_name};
 await page.goto(H+'/settings/organization/departments/'+newId,{waitUntil:'commit',timeout:120000});await wt(/Department Name/,60000);await page.waitForTimeout(3000);out.reopenChecked=await page.getByLabel('Display in Help Center').isChecked().catch(()=>null);await shot('g4-reopened');}
return Object.assign(out,{calls:[...new Set(calls)]});
