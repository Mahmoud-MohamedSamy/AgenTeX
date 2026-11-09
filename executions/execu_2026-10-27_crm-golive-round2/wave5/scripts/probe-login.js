await shot('login-state'); return { url: page.url(), text: (await page.innerText('body').catch(()=>'')).replace(/\s+/g,' ').slice(0,300) };
