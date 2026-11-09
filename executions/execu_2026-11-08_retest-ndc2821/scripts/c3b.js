const o={};await openTab();o.head=(await txt()).match(/Department .{0,50}/)?.[0];
const lab=page.getByText('Department',{exact:true}).first();o.lab=await lab.boundingBox();
await page.screenshot({path:S+'c3b-0.png'});await page.mouse.click(o.lab.x+o.lab.width+120,o.lab.y+o.lab.height/2);await page.waitForTimeout(1500);await page.screenshot({path:S+'c3b-1.png'});
o.opts=await page.locator('[role=option],[role=menuitem]').evaluateAll(e=>e.map(x=>x.innerText.trim()).slice(0,6));o.searchInputs=await page.locator('input:visible').evaluateAll(e=>e.map(x=>x.placeholder));return o;
