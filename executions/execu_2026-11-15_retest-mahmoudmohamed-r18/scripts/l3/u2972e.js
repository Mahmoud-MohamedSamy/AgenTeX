await page.goto(H+'/settings/users-control/profiles',{waitUntil:'domcontentloaded'}); await sleep(11000);
const ex=page.getByText('Expand all').first(); if(await ex.count()) { await ex.click(); await sleep(1500); }
const row=page.getByText('QA RT18 profile',{exact:true}).first(); log('row', await row.count()); await row.scrollIntoViewIfNeeded(); await row.hover(); await sleep(800);
const keys=await page.locator('[aria-label],[title]').evaluateAll(e=>e.map(x=>(x.getAttribute('aria-label')||x.getAttribute('title'))).filter(t=>/perm/i.test(t)).slice(0,5)); log('perm controls', keys);
await shot('2972-6-profiles-row.png');
const r2=row.locator('xpath=ancestor::*[.//*[contains(@aria-label,"ermission") or contains(@title,"ermission")]][1]');
const k=r2.locator('[aria-label*="ermission"],[title*="ermission"]').first(); log('key', await k.count(), await k.getAttribute('aria-label').catch(()=>null), await k.getAttribute('title').catch(()=>null));
await k.click(); await sleep(9000); log('url after key', page.url().replace(H,'')); log('head', ((await text()).match(/QA RT18 profile[^\n]*\n[^\n]*/g)||[]).slice(0,2)); await shot('2972-7-key-opens.png');
