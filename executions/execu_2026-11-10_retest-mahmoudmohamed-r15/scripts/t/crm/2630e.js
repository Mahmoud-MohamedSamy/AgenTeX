const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/modules/'+L+'/records/5eab324e-fa2b-49fa-a63b-07e0bfe38a35', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if (/2630 send real/.test(await text())) break; }
await sleep(2000);
await page.getByRole('button', {name:'Send Email'}).first().click(); await sleep(4000);
const d = page.locator('[role=dialog]').last(); const t = (await d.innerText().catch(()=>'')) || (await text()).slice(-1500);
log(t.replace(/[\w.+-]+@[\w.-]+/g,'<email>').slice(0,1200));
await shot('NDC-2630-compose.png');
const sendBtn = d.getByRole('button', {name:/^Send$/}); log('send enabled', await sendBtn.count() ? await sendBtn.first().isEnabled() : 'no send button');
await page.keyboard.press('Escape');
