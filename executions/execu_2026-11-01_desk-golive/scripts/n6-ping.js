await page.goto(H+'/hq',{waitUntil:'commit'}).catch(()=>{});await sleep(8000);return JSON.stringify({u:page.url()});
