var RUNP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG';
eval(require('fs').readFileSync(RUNP+'/scripts/lib.js','utf8'));
const RAW=RUNP+'/evidence/raw/';const o={};
const nm={[IDS.A]:'TestUser1',[IDS.B]:'QATeam1',[IDS.me]:'owner(creator)'};
const rrSet=async on=>{const g=(await api('GET','/desk/assignment-rules?type=round_robin&department_id='+IDS.D)).j.data.rules.find(x=>x.id===IDS.ruleRR);const r=await api('PUT','/desk/assignment-rules/'+IDS.ruleRR+'/active',{is_active:on,version:g.version});LED('UPDATED RR rule '+IDS.ruleRR+' active='+on+': '+r.s);return r.s;};
o.rrOn=await rrSet(true);
try{
await page.setViewportSize({width:1440,height:900});
let sent=null,resp=null;
page.on('request',r=>{if(r.method()==='POST'&&/\/modules\/[^/]+\/records$/.test(r.url())){try{const b=JSON.parse(r.postData()||'{}');sent=(b.data||[]).map(x=>x.field+'='+JSON.stringify(x.value).slice(0,60));}catch(e){sent='unparsed';}}});
page.on('response',async r=>{if(r.request().method()==='POST'&&/\/modules\/[^/]+\/records$/.test(r.url())){try{const j=await r.json();resp={s:r.status(),id:j.data&&j.data.id};}catch(e){}}});
await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'domcontentloaded',timeout:120000});
for(let i=0;i<30;i++){await page.waitForTimeout(2000);const t=await page.innerText('body');if(/Subject/.test(t)&&/Department/.test(t))break;}
const lab=page.locator('text=/^Department$/').first();const bb=await lab.boundingBox();
await page.mouse.click(bb.x+bb.width+140,bb.y+bb.height/2);await page.waitForTimeout(2500);
await page.keyboard.type('QA FT 1865',{delay:60});await page.waitForTimeout(3000);
await page.locator('[role=option]:has-text("QA FT 1865 Dept"), li:has-text("QA FT 1865 Dept"), button:has-text("QA FT 1865 Dept")').first().click();await page.waitForTimeout(6000);
// subject
await page.getByPlaceholder('Type or pick a subject').first().click();await page.waitForTimeout(800);
await page.keyboard.type('QA FT 1865 RR UI ticket',{delay:30});await page.keyboard.press('Escape');await page.waitForTimeout(800);
// status
const stb=await page.evaluate(()=>{const L=[...document.querySelectorAll('label,span,div')].find(e=>e.children.length<=2&&/^\*?\s*Status$/.test((e.innerText||'').trim()));if(!L)return null;const r=L.getBoundingClientRect();return {x:r.right,y:r.top+r.height/2};});o.stb=stb;
if(stb){await page.mouse.click(stb.x+150,stb.y);await page.waitForTimeout(1500);}
const op=page.locator('[role=option]:has-text("Open"), li:has-text("Open")').first();if(await op.count())await op.click();await page.waitForTimeout(800);
const bt=await page.innerText('body');o.ownerShown=(bt.match(/Ticket Owner\n(?:[A-Z]\n)?([^\n]+)/)||[])[1];
await page.screenshot({path:RAW+'_ui-before-save.png'});
await page.locator('button:has-text("Save")').filter({hasText:/^Save$/}).first().click();await page.waitForTimeout(10000);
o.sent=sent;o.resp=resp;
if(resp&&resp.id){LED('CREATED ticket "QA FT 1865 RR UI ticket" '+resp.id+' (UI New Ticket form, default owner)');IDS.tickets.push(resp.id);saveIds();
 await sleep(6000);const x=await getT(resp.id);o.ownerAfter=nm[oid(x.owner)]||oid(x.owner);}
await page.screenshot({path:RAW+'_ui-after-save.png'});
} finally { o.rrOff=await rrSet(false); }
return o;
