await page.goto(H + '/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Lead Source/.test(await text())) break; }
const ls = page.getByText('Lead Source', {exact:true}).first(); await ls.hover(); await sleep(800);
await ls.locator('xpath=ancestor::*[.//button][1]').getByRole('button', {name:'Field options'}).click(); await sleep(1500);
await page.getByText('Edit Properties', {exact:true}).click(); await sleep(3000);
const t = await text(); const k = t.search(/[Gg]lobal [Ss]et/); log('gs text', k, t.slice(Math.max(0,k-1200), k+800)); await shot('2806-ls-props.png');
const btns = await page.$$eval('button, [role=radio], [role=switch], label', bs => bs.map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(x=>/global|convert|associate/i.test(x))); log(btns);
