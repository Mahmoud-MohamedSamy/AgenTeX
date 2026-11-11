const id='1f8e6e33-174e-4065-872c-9e2f82f70d2d'; // QA RT15 2205 dept AO ticket
await page.goto(H + '/views/all/tickets/'+id, { waitUntil: 'domcontentloaded' }); for (let i=0;i<30;i++){ await sleep(2000); if (/QA RT15 2205/.test(await text())) break; } await sleep(3000);
const rail = await page.$$eval('button', bs => bs.map(b=>{const r=b.getBoundingClientRect(); return {a:b.getAttribute('aria-label')||b.getAttribute('title')||'', t:b.innerText.trim().slice(0,20), x:Math.round(r.x), y:Math.round(r.y)};}).filter(o=>o.x>310 && o.x<370 && o.y>60 && o.y<400));
log('rail', rail);
const sk = page.locator('button[aria-label*="kill" i], button[title*="kill" i]').first();
if (await sk.count()) { await sk.click(); await sleep(3000); const t = await text(); const k = t.indexOf('Skills'); log('panel', t.slice(k, k+600).replace(/\n+/g,' | ')); await shot('2827-skills-panel.png'); }
else { await shot('2827-no-skills-icon.png'); }
