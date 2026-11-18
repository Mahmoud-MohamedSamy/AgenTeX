const reqs=[]; page.on('request',r=>{const u=r.url(); if(/api\/v1\/iam/.test(u)&&!/iam\/auth/.test(u)) reqs.push(r.method()+' '+u.split('/api/v1')[1].slice(0,120));});
await page.goto(H+'/settings',{waitUntil:'domcontentloaded'}); await sleep(9000);
await page.getByRole('button',{name:'Profiles',exact:true}).first().click(); await sleep(9000);
log('url',page.url().replace(H,'')); const m=(await page.locator('main').last().innerText()).replace(/\s+/g,' '); log('main', m.slice(m.indexOf('Profiles'),m.indexOf('Profiles')+1500)); await shot('2972-1-profiles.png');
const btns=await page.locator('button[aria-label], a[aria-label]').evaluateAll(e=>e.map(x=>x.getAttribute('aria-label')).filter(t=>/perm|edit|profile/i.test(t)).slice(0,20)); log('btns',btns);
log('reqs',[...new Set(reqs)]);
