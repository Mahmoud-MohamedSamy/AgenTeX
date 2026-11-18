await page.goto(H+'/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3?view=f79332b2-678a-44a4-83cc-d6921f1582ad',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){ await sleep(2000); const t=await text(); if(/Tier LB1|Tier LS1/.test(t)) break; } await sleep(3000);
const t=await text(); log('rows',(t.match(/Tier L[A-Z0-9]+[^\n]*\n?[^\n]*/g)||[]).slice(0,10));
await page.mouse.click(1566,165); await sleep(2500); log("panel",(await text()).slice(-1500)); const cb=page.getByText("QA RT19 GS Tier",{exact:true}).last(); if(await cb.count()){ await cb.click(); await sleep(1500);} const ap=page.getByRole("button",{name:/^(Apply|Save|Done)$/}).last(); if(await ap.count()){ await ap.click(); } else { await page.keyboard.press("Escape"); } await sleep(5000); log("rows2",((await text()).match(/(Silver|Platinum|Bronze)/g)||[]).join(",")); await shot("2870-9-tavi-sorted-view.png");
return {};
