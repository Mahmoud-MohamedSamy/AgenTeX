await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'domcontentloaded' });
for (let i=0;i<40;i++){ await sleep(2000); if ((await page.$$('input,textarea')).length > 4) break; }
await shot('2205-form.png');
const combos = await page.$$eval('button, [role=combobox], select, input, textarea', cs => cs.map(c => (c.getAttribute('aria-label')||c.getAttribute('placeholder')||c.name||c.innerText||'').trim().slice(0,30)+':'+c.tagName+':'+(c.type||'')).filter(x=>!/^:/.test(x)).slice(0,80)); log(combos);
const t = await text(); log(t.slice(-2000));
