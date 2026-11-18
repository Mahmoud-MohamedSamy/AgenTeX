await page.goto(H+'/settings/data/export',{waitUntil:'domcontentloaded'}); await sleep(12000);
const m=page.locator('main').last();
await m.getByRole('button',{name:'Module',exact:true}).first().click(); await sleep(1200); await page.getByRole('option',{name:/^Contacts$/}).first().click(); await sleep(2000);
await m.getByRole('button',{name:'Records',exact:true}).click(); await sleep(1500);
const views=(await page.locator('[role=listbox]').last().innerText().catch(()=>'')).replace(/\s+/g,' | ').slice(0,1500);
await page.keyboard.press('Escape');
const t=(await m.innerText()).replace(/\s+/g,' '); const c=t.indexOf('Email Providers');
return {views, t:t.slice(c+15,c+1500)};
