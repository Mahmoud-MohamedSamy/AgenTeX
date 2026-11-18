const reqs=[]; page.on('request',r=>{const u=r.url(); if(/api\/v1\/iam/.test(u)&&!/iam\/auth|iam\/me/.test(u)) reqs.push(r.method()+' '+u.split('/api/v1')[1].slice(0,140));});
await page.goto(H+'/settings',{waitUntil:'domcontentloaded'}); await sleep(9000);
await page.getByRole('button',{name:'Permissions',exact:true}).first().click(); await sleep(10000);
log('url',page.url().replace(H,'')); const m=(await page.locator('main').last().innerText()); const i=m.lastIndexOf('Email Providers'); log('main', m.slice(i+15,i+3000).replace(/\n+/g,' | ')); await shot('2972-2-permissions.png',{fullPage:false});
log('controls', await page.locator('main [role=switch], main input[type=checkbox]').count());
log('reqs',[...new Set(reqs)]);
