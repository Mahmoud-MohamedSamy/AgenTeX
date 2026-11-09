const o={};const A='QA RT14 alpha';
await openTab();await pick('QA AS6 Dept A');o.pickA=await shown();
o.add=await addType(A);LED('skill type "'+A+'" added in QA AS6 Dept A');o.afterAdd=await shown();o.apiA=await tnames(DA);o.apiB=await tnames(DB);await page.screenshot({path:S+'c2-dept-a-added.png'});
await pick('QA AS6 Dept B');o.uiB=await shown();await page.screenshot({path:S+'c2-dept-b-not-listed.png'});
await openTab();await pick('QA AS6 Dept A');o.reloadA=await shown();
await pick('QA AS6 Dept B');o.addSameB=await addType(A);LED('skill type "'+A+'" added in QA AS6 Dept B');o.uiB2=await shown();
o.dupB=await addType(A);o.uiB3=await shown();o.dupText=(await txt()).match(/.{0,80}(already|exists|duplicate).{0,80}/i)?.[0]||null;await page.screenshot({path:S+'c2-dept-b-duplicate.png'});
o.btnLabels=await page.locator('button[aria-label*="QA RT14"]').evaluateAll(e=>e.map(x=>x.getAttribute('aria-label')));
return o;
