var RUNP='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-1865/functional/laneG';
eval(require('fs').readFileSync(RUNP+'/scripts/lib.js','utf8'));
const RAW=RUNP+'/evidence/raw/';const o={};
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/modules/'+T+'/records/new',{waitUntil:'domcontentloaded',timeout:120000});
for(let i=0;i<30;i++){await page.waitForTimeout(2000);const t=await page.innerText('body');if(/Subject/.test(t)&&/Department/.test(t))break;}
// Department picker: the control right under the "Department" label
const lab=page.locator('text=/^Department$/').first();const bb=await lab.boundingBox();o.labBox=bb;
if(bb){await page.mouse.click(bb.x+bb.width+140,bb.y+bb.height/2);await page.waitForTimeout(2500);}
await page.screenshot({path:RAW+'_ui-dept-open.png'});
await page.keyboard.type('QA FT 1865',{delay:60});await page.waitForTimeout(3000);
const opt=page.locator('[role=option]:has-text("QA FT 1865 Dept"), li:has-text("QA FT 1865 Dept"), button:has-text("QA FT 1865 Dept")').first();o.optCount=await opt.count();
if(o.optCount){await opt.click();await page.waitForTimeout(6000);}
const sel=page.locator('select[aria-label="Layout"]');o.layoutOpts=await sel.locator('option').allInnerTexts();o.layoutNow=await sel.inputValue().catch(()=>null);
if(o.layoutOpts.some(x=>/QA FT 1865/.test(x))){await sel.selectOption({label:'QA FT 1865 Layout'});await page.waitForTimeout(6000);}
const bt=await page.innerText('body');o.fieldsShown={text:bt.includes('QA FT1865 Text'),pick:bt.includes('QA FT1865 Pick')};
o.deptText=(bt.match(/Department\n([^\n]+)/)||[])[1];
await page.screenshot({path:RAW+'_ui-form-layout.png'});
return o;
