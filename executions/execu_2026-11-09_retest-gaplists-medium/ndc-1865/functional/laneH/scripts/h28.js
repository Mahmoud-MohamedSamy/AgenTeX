let step='nav';try{
await page.goto(H+'/settings/data/import',{waitUntil:'load',timeout:120000});await page.waitForTimeout(10000);out.url=page.url();
const t=await body();out.page=t.slice(t.indexOf('Import',t.indexOf('Sandboxes'))).split('\n').filter(l=>l.trim()).slice(0,45);await shot('d2-import');
}catch(e){out.err=step+': '+String(e).slice(0,140);}
return Object.assign(out,{calls:[...new Set(calls)]});
