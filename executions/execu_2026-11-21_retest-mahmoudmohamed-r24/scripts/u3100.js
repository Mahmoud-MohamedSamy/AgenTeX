const R={};const bt=async()=>(await page.locator('main').first().innerText({timeout:20000}).catch(()=>'')).replace(/\s+/g,' ');
const go=async()=>{await page.goto(H+'/settings/users-control/agents/876ce871-2b02-4854-89a7-68050391c62b',{waitUntil:'commit'});await sleep(9000);};
await go();let t=await bt();const k=t.search(/Tickets owned/);R.en=t.slice(k,k+160);R.rawEn=/records\.views/.test(t);await shot('3100-r1-a-en.png',{timeout:90000});
await page.getByRole('button',{name:/^EN/}).first().click();await sleep(1000);R.langs=(await page.locator('[role=menuitem],[role=option]').allInnerTexts()).slice(0,5);
await page.getByText(/العربية|Arabic/).first().click({timeout:10000});await sleep(4000);await go();t=await bt();R.rawAr=/records\.views/.test(t);const j=t.search(/التذاكر|Tickets owned/);R.ar=t.slice(Math.max(0,j),j+200);await shot('3100-r1-b-ar.png',{timeout:90000});
await page.getByRole('button',{name:/^(AR|ع)/}).first().click().catch(()=>{});await sleep(1000);await page.getByText(/^English$/).first().click().catch(()=>{});await sleep(3000);R.back=(await page.locator('header, body').first().innerText()).includes('Knowledge Base');
return R;
