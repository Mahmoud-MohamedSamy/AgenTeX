const nn = n0 => NET.slice(n0).filter(x => !/heartbeat|resolved-batch|realtime/.test(x.u)).map(x => x.m + ' ' + x.u + ' ' + x.s + ' ' + x.t.slice(0, 220));
const hc = arr(D((await api('GET', '/help-centers')).j))[0];
// W4-80 second help center + invalid domain
let r = await api('POST', '/help-centers', { name: 'QA GL W4 brand' }); out.second = r.s + ' ' + r.t.slice(0, 250); if (r.j && r.j.data && r.j.data.id) CREATED.push({ kind: 'help-center', id: r.j.data.id, name: 'QA GL W4 brand' });
r = await api('PUT', '/help-centers/' + hc.id + '/domain', { domain: 'abc' }); out.domain = r.s + ' ' + r.t.slice(0, 200);
// W4-52 help widgets
await go('/settings/self-service/help-widgets', 12000);
let n0 = NET.length;
await page.getByRole('button', { name: /^New widget/ }).click(); await sleep(3000);
out.newUrl = page.url().replace(H, '');
const d = page.locator('[role=dialog]').last(); const hasD = await d.count();
out.newForm = ((hasD ? await d.innerText() : await page.locator('main').last().innerText())).replace(/\s+/g, ' ').slice(0, 900);
out.newCtrls = await (hasD ? d : page.locator('main').last()).locator('input,button[aria-haspopup],select').evaluateAll(es => es.map(e => [e.tagName, e.id, e.getAttribute('type'), (e.innerText || e.value || '').trim().slice(0, 25)].join('|')));
await shot('w4/W4-52-new-widget');
return fin({ out });
