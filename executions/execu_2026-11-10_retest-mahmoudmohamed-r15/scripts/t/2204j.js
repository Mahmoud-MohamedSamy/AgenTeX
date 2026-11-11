await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' }); for (let i=0;i<20;i++){ await sleep(2000); if (/Roles|Users|Agents/.test(await text())) break; }
const links = await page.$$eval('a', as => as.map(a => a.innerText.trim()+' => '+a.getAttribute('href')).filter(s=>/role|user|agent|people|profile/i.test(s))); log(links.slice(0,20));
const items = await page.$$eval('button, [role=link]', bs => bs.map(b=>b.innerText.trim()).filter(s=>/^(Roles|Agents|Users|Profiles)/.test(s))); log(items);
const r = page.getByText('Roles', {exact:true}).first(); if (await r.count()) { await r.click(); await sleep(6000); log(page.url()); const t = await text(); log(t.slice(t.lastIndexOf('Roles'), t.lastIndexOf('Roles')+1500)); await shot('2204-desk-roles.png'); }
