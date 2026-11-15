const TK = 'f642b146-8c00-4e6e-8b89-82bb5def710d';
const me = await api('GET', '/iam/me'); out.me = String((D(me.j) || {}).email || '').slice(0, 4);
const r = await api('GET', '/modules/' + TM + '/records/' + TK); out.api = r.s;
await go('/views/all/tickets/' + TK, 12000); const t = (await page.locator("main").last().innerText().catch(()=>"")); out.page = (t.match(/.{0,80}(Happiness|rated|Rating|Good).{0,100}/gi) || []).slice(0, 5); out.denied = /permission|not allowed|access/i.test(t.slice(0, 400)) ? t.slice(0, 200) : '';
for (const tab of ['Happiness', 'Rating']) { const tb = page.locator('main').getByText(new RegExp('^' + tab), { exact: false }).first(); if (await tb.count()) { await tb.click().catch(() => {}); await sleep(3000); out['tab ' + tab] = ((await page.locator("main").last().innerText().catch(()=>""))).match(/.{0,80}(Good|rated).{0,120}/i)?.[0]; } }
await shot('w4/W4-78-agentC');
return fin({ out });
