const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', id = 'e8e8c1dd-8468-4199-8f7c-db017aeebd02'; const out = { reqs: [] };
out.setEmail = (await api('PATCH', `/modules/${L}/records/${id}`, { data: [{ field: 'email', value: { kind: 'string', value: 'mahmoud.mmohamedsamy@gmail.com' } }] })).s;
page.on('response', async r => { const q = r.request(); if (/\/mail\//.test(r.url()) && q.method() !== 'GET') { let b = ''; try { b = (await r.text()).slice(0, 300); } catch (e) {} out.reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '').slice(0, 80) + ' ' + (q.postData() || '').replace(/[\w.+-]+@[\w.-]+/g, '<email>').slice(0, 250) + ' => ' + b.replace(/[\w.+-]+@[\w.-]+/g, '<email>')); } });
await go(`/modules/${L}/records/${id}`, 6000); for (let j = 0; j < 45 && !/QA RT r8 attach/.test(await txt()); j++) await sleep(2000); await sleep(3000);
await page.getByRole('button', { name: /Send Email/i }).first().click(); await sleep(5000); await shot('v37-compose');
out.compose = (await txt()).split('\n').map(l => l.trim()).filter(l => /From|To|Subject|connection|Send|taviportal|zoho/i.test(l)).slice(0, 15).map(l => l.replace(/[\w.+-]+@[\w.-]+/g, '<email>'));
return done(out);
