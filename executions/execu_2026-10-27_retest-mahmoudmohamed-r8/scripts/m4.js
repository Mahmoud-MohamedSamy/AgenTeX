const out = {}; const reqs = []; page.on('request', r => { if (['PUT', 'POST', 'PATCH'].includes(r.method()) && r.url().includes('/api/')) reqs.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 500)); });
await go('/', 9000); await go('/settings/modules-and-fields', 12000); await shot('m4-mf');
out.t1 = (await txt()).split('\n').filter(l => /Leads|Modules/i.test(l)).slice(0, 6);
await page.mouse.click(397, 256); await sleep(10000); await shot('m4-leads');
out.url = page.url(); out.t2 = (await txt()).split('\n').filter(l => /Layout|QA RT r8|Access/i.test(l)).slice(0, 20);
return done({ ...out, reqs });
