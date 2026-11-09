const fs=require('fs');const I=JSON.parse(fs.readFileSync('../out/ids.json','utf8'));const o={};
const t=await api('GET','/desk/skill-types?department_id='+I.DA);o.read=t.s;const id=t.j&&t.j.data&&t.j.data.types&&t.j.data.types[0]&&t.j.data.types[0].id;
const add=await api('POST','/desk/skill-types',{name:'QA RT14 denied',department_id:I.DA});o.add=add.s+' '+((add.j&&add.j.error&&add.j.error.code)||'');
if(id){const r=await api('PUT','/desk/skill-types/'+id,{name:'QA RT14 denied'});o.rename=r.s;const d=await api('DELETE','/desk/skill-types/'+id);o.del=d.s;}
await page.setViewportSize({width:1600,height:1000});await page.goto(H+'/settings/customization/skills?tab=skill-types',{waitUntil:'commit',timeout:180000});await page.waitForTimeout(15000);const x=(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');o.page=x.slice(-160);o.deleteButtons=await page.locator('button[aria-label^="Delete "]').count();await page.screenshot({path:'../screenshots/raw/c12-agent.png'});
return o;
