const out = { reqs: [] };
page.on('response', async r => { const q = r.request(); if (['PUT', 'POST', 'PATCH'].includes(q.method()) && /\/modules\/841043e1[^/]*\/(layouts|fields)/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 160); } catch (e) {} out.reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 110) + ' => ' + b); } });
out.before = arr((await api('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts')).j?.data).filter(l => /^New Layout/.test(l.name)).map(l => l.name + ' ' + l.id);
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(30000); await shot('v41-second-save');
out.after = arr((await api('GET', '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts')).j?.data).filter(l => /^New Layout/.test(l.name)).map(l => l.name + ' ' + l.id);
out.msgs = (await txt()).split('\n').map(l => l.trim()).filter(l => /saved|updated|created|success|Failed|already|exists|error/i.test(l)).slice(0, 6); out.url = page.url();
return done(out);
