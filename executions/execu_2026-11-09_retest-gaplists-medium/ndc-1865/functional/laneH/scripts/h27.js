let step='nav';try{
await page.goto(H+'/settings',{waitUntil:'load',timeout:120000});await wt(/Data Administration/);await page.waitForTimeout(1500);
await page.getByText('Export',{exact:true}).first().click();await page.waitForTimeout(8000);out.url=page.url();
out.page=(await body()).split('\n').filter(l=>l.trim()).slice(0,60);await shot('d1-export');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('d-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
