module.exports=async(page,z)=>{await page.goto('https://desk.zoho.com/agent/techegysolutions/techegysolutions/setup#setup/customization/1499272000000006907/emailtemplates',{waitUntil:'commit',timeout:90000});
await page.getByText('Notify agent on assigning a Call').first().waitFor({timeout:120000}).catch(()=>{});await page.waitForTimeout(3000);
const r=[];for(const fr of page.frames()){r.push(fr.url().slice(0,80)+' '+(await fr.locator('text=/acknowledge/i').count().catch(()=>-1)));}
const a=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(e=>e.children.length==0&&/cknowledge/i.test(e.textContent)).map(e=>e.tagName+':'+e.textContent.trim().slice(0,60)));return r.join('\n')+'\n'+a.join('\n');};
