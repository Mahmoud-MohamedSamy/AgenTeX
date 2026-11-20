const R={};const name=process.env.FN;
for(let a=0;a<3;a++){await page.goto(H+(process.env.WP||'/settings/web-forms'),{waitUntil:'commit'});if(await page.getByText(name).first().waitFor({timeout:60000}).then(()=>1,()=>0))break;}
R.url=page.url().replace(H,'');const box=await page.getByText(name).first().boundingBox();R.box=box;
const btns=page.getByRole('button',{name:/Embed code/});let best=null,bd=1e9;for(let i=0;i<await btns.count();i++){const bb=await btns.nth(i).boundingBox();if(bb&&Math.abs(bb.y-box.y)<bd){bd=Math.abs(bb.y-box.y);best=btns.nth(i);}}await best.click();await sleep(3000);
const t=(await page.locator('body').innerText()).replace(/\s+/g,' ');R.hits=(t.match(/[^.]{0,80}(website list|No website is listed|any website)[^.]{0,120}\./g)||[]).slice(0,5);
await page.getByText(/No website is listed in the form/).first().scrollIntoViewIfNeeded();await sleep(1000);R.msgBox=await page.getByText(/No website is listed in the form/).first().boundingBox();await shot(process.env.OUT,{timeout:60000});return R;
