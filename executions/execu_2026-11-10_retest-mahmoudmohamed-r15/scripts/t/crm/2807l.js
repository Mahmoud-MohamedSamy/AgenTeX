const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
await page.goto(H + '/modules/'+L+'/mass-delete', { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/Mass Delete/i.test(await text()) && !/Loading…/.test(await text())) break; }
await sleep(3000);
const t = await text(); const k = t.search(/Mass Delete/i); log(t.slice(k, k+1500));
await shot('NDC-2807-md-page.png');
const ctrls = await page.$$eval('select, input, button', cs => cs.map(c => c.tagName+':'+(c.innerText||c.getAttribute('placeholder')||c.getAttribute('aria-label')||c.type||'').trim().slice(0,40)).filter(x=>!/^BUTTON:(Automation menu|Expand)/.test(x)).slice(-40)); log(ctrls);
