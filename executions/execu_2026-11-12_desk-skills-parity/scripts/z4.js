async (page, frame) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup#setup/customization/skills', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(12000);
 const f = frame(); const t = await f.innerText('body').catch(()=>'');
 return { url: page.url().replace(/\?.*/,''), frames: page.frames().map(x=>x.url().slice(0,90)), text: t.slice(0, 3000) }; }
