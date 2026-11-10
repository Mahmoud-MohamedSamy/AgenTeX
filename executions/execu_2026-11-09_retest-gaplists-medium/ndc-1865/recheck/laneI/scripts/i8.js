for(const p of ['/settings/organization/departments','/settings/general/departments','/settings/departments/list']){await page.goto(H+p,{waitUntil:'commit',timeout:120000});await page.waitForTimeout(12000);out[p]=page.url()+' | '+(await body()).split('\n').filter(l=>/Department/i.test(l)).slice(0,4).join(' / ');if(/QA NDC Technical Support|New Department|Add Department/i.test(await body()))break;}
await shot('g0-departments-list');
const add=page.locator('button, a').filter({hasText:/New Department|Add Department|Create Department/i}).first();out.addCount=await add.count();
if(out.addCount){await add.click();await page.waitForTimeout(6000);out.form=(await body()).split('\n').filter(l=>l.trim()).slice(-60);await shot('g1-new-dept-form');}
return Object.assign(out,{calls:[...new Set(calls)]});
