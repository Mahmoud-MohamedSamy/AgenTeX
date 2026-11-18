await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'}); await page.getByText('CHANNELS').first().waitFor({timeout:90000}); await sleep(3000);
for (const s of ['CHANNELS','SELF SERVICE','AUTOMATION']) { await page.getByText(s,{exact:true}).first().click().catch(()=>{}); await sleep(800); }
log('hrefs', await page.locator('a[href^="/settings"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')+' '+e.innerText.trim()).filter(x=>/form|help|portal|center/i.test(x))));
