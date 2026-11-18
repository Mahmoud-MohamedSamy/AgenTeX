await page.goto(H+'/settings/automation/assignment-rules',{waitUntil:'domcontentloaded'});await sleep(9000);
const grab=()=>text().then(t=>[...new Set((t.match(/[^\n]*skill[^\n]*/gi)||[]).map(s=>s.trim().slice(0,300)))]);
log('url '+page.url());log('tabs '+JSON.stringify(await page.getByRole('tab').allInnerTexts()));log('main '+JSON.stringify(await grab()));
for(const t of await page.getByRole('tab').all()){const n=(await t.innerText()).trim();await t.click().catch(()=>{});await sleep(4000);const g=await grab();if(g.length)log('tab '+n+' '+JSON.stringify(g));}
// open our rule
const r=page.getByText(/QA RT19 SK 2931 skill/).first();log('rule link '+await r.count());
