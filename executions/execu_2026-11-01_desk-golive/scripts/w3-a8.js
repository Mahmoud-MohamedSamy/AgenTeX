const ACC = '03e7893b-dc27-4a01-be0e-ac2f955a3b8d', K = 'c5a8482a-0bce-4fb0-94b5-ee7b939e72ac', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd', T2 = '53c188f7-9e88-42b3-8d3a-515dfdc31f61';
const MT = async () => (await page.locator('#main-content').innerText().catch(() => '')).replace(/\s+/g, ' ');
await go('/views/all/tickets/' + T1, 12000); let t = await MT(); out.t1 = (t.match(/.{0,60}(SLA|Contract|Plan|Due|First response).{0,160}/gi) || []).slice(0, 6); await shot('w3/W3-06-ticket1');
await go('/views/all/tickets/' + T2, 12000); t = await MT(); out.t2 = (t.match(/.{0,60}(SLA|Contract|Plan|Due|First response).{0,160}/gi) || []).slice(0, 6); await shot('w3/W3-06-ticket2');
await go('/modules/' + KM + '/records/' + K, 9000); t = await MT(); out.k = (t.match(/Support Plan Info.{0,200}/) || [''])[0]; await shot('w3/W3-06-contract-credits');
await go('/modules/' + AM + '/customers/' + ACC, 9000); const tb = page.locator('#main-content').getByText('SLA & Contract', { exact: true }).first(); out.hasTab = await tb.count(); if (out.hasTab) { await tb.click(); await sleep(4000); } out.acc = (await MT()).slice(0, 700); await shot('w3/W3-05-account-contract');
return fin({ out });
