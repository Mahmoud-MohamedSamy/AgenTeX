await page.goto(H+'/views/all/tickets',{waitUntil:'commit'});await sleep(8000);return page.url().replace(H,'');
