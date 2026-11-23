const R={};const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H+'/settings/modules-and-fields/'+L,{waitUntil:'domcontentloaded'});
for(let i=0;i<80;i++){await sleep(3000);if(await page.getByText(/^Validation Rules$/i).count())break;}
await page.getByText(/^Validation Rules$/i).first().click();for(let i=0;i<30;i++){await sleep(2000);if(await page.locator('tr',{hasText:'QA RT26 VR'}).count())break;}
const row=page.locator('tr',{hasText:'QA RT26 VR'}).first();R.row=(await row.innerText()).replace(/\s+/g,' ');await shot('3126-list2.png');
await row.locator('button').filter({has:page.locator('svg')}).first().click();await sleep(4000);const d2=page.locator('[role=dialog]:visible').last();
R.geom=await d2.evaluate(d=>{const r=d.getBoundingClientRect();const pick=[...d.querySelectorAll('input,textarea,button[role=combobox],[role=radio],[role=switch]')].filter(e=>e.offsetParent);return {dl:Math.round(r.left),dr:Math.round(r.right),minL:Math.min(...pick.map(e=>Math.round(e.getBoundingClientRect().left-r.left))),minR:Math.min(...pick.map(e=>Math.round(r.right-e.getBoundingClientRect().right)))};});
await page.mouse.move(800,600);await page.mouse.wheel(0,330);await sleep(1000);await shot('3126-edit-mid.png');
await page.mouse.wheel(0,2000);await sleep(1000);await shot('3126-edit-bottom.png');
await d2.getByRole('button',{name:'Cancel'}).click();return R;
