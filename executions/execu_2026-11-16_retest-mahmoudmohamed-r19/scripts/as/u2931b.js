const R={};
for(const u of ['/settings/automation/skills','/settings/automation/assignment-rules/skills','/settings/automation/assignment-rules?view=round-robin']){
 await page.goto(H+u,{waitUntil:'domcontentloaded'});await sleep(9000);
 const t=(await text()).replace(/\s+/g,' ');R[u]={url:page.url(),hit:(t.match(/[^.]{0,220}skill[^.]{0,220}/gi)||[]).filter(s=>/round robin|assign/i.test(s)).slice(0,6)};
}
return R;
