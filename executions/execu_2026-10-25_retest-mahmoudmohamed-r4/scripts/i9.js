const DC = '43004ce2-577f-4eda-b00a-0750fe40c3d4'; const s = v => ({ kind: 'string', value: v });
const r = await api('POST', `/modules/${DC}/records`, { data: [{ field: 'first_name', value: s('QA RT') }, { field: 'last_name', value: s('2395 Dup') }, { field: 'email', value: s('qa.rt.2393@example.com') }] });
const id = r.j?.data?.id; await sleep(45000);
const fails = arr((await api('GET', '/desk/integrations/crm/failures?limit=50')).j?.data).filter(f => (id && JSON.stringify(f).includes(id)) || /2393|2395/.test(JSON.stringify(f))).map(f => ({ kind: f.kind, err: f.last_error }));
await page.goto(H + '/settings/integrations/crm', { waitUntil: 'commit', timeout: 90000 }); await sleep(6000);
const tab = page.getByRole('tab', { name: /Failure Log/ }); if (await tab.count()) { await tab.click(); await sleep(3000); }
const ui = (await txt()).split('\n').filter(l => /already paired|2395|2393/.test(l)).slice(0, 4);
await shot('2395-01-failure-log');
return done({ created: r.s + ' ' + id, fails, ui });
