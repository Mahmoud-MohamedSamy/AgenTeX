const out = {}; const reqs = []; page.on('response', async r => { const q = r.request(); if (['PATCH', 'POST'].includes(q.method()) && /records/.test(r.url())) { let b = ''; try { b = (await r.text()).slice(0, 200); } catch (e) {} reqs.push(r.status() + ' ' + q.method() + ' ' + r.url().replace(API, '') + ' ' + (q.postData() || '').slice(0, 250) + ' => ' + b); } });
const chip = page.getByText('Standard', { exact: true }).first(); await chip.click(); await sleep(2000); await shot('v14-pipeline-menu');
out.menu = (await txt()).split('\n').filter(l => /^1$|Standard|Change pipeline|pipeline/i.test(l)).slice(0, 12);
const one = page.getByRole('option', { name: '1', exact: true }).or(page.getByRole('menuitem', { name: '1', exact: true })); if (await one.count()) { await one.first().click(); } else { await page.getByText('1', { exact: true }).last().click().catch(() => {}); }
await sleep(2500); await shot('v14-change-dialog');
out.dialog = (await txt()).split('\n').filter(l => /Stage|stage|Change pipeline|test-0|Cancel|default|first/i.test(l)).slice(0, 15);
const confirm = page.getByRole('button', { name: /Change pipeline|Confirm/i }).last(); if (await confirm.count()) { await confirm.click(); await sleep(6000); }
await shot('v14-after-change');
out.after = (await txt()).split('\n').filter(l => /PIPELINE|STAGE|^1$|test-0|Standard|updated|error|Invalid/i.test(l)).slice(0, 15);
out.reqs = reqs; return done(out);
