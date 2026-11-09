const o={};const S='../screenshots/raw/';await page.setViewportSize({width:1600,height:1000});
const txt=async()=>(await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ');
await page.goto(H+'/settings/customization/skills?tab=skill-types',{waitUntil:'commit',timeout:180000});
for(let i=0;i<60;i++){await page.waitForTimeout(3000);if(/Add type/.test(await txt()))break;}await page.waitForTimeout(2000);
o.head=(await txt()).match(/Skills Define.{0,450}/)?.[0];await page.screenshot({path:S+'c1-types-tab.png'});
o.controls=await page.$$eval('main select,main [role=combobox],main input',e=>e.map(x=>x.tagName+'|'+(x.getAttribute('role')||'')+'|'+(x.getAttribute('aria-label')||x.placeholder||x.name||x.id||'')+'|'+(x.innerText||x.value||'').slice(0,40)));
o.url=page.url();return o;
