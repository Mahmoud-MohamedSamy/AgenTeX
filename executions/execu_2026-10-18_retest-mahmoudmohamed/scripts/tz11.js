const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = { reqs: [] };
const crit = op => ({ pattern: '1 AND 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA RT tz' }, { field: 'date_time', operator: op }] });
const g = await api('GET', '/modules/' + L + '/views/' + V);
await api('PATCH', '/modules/' + L + '/views/' + V, { settings: { ...g.j.data.settings, criteria: crit('today') }, row_version: g.j.data.row_version });
const fr = async r => { if (/\/records\?/.test(r.url())) { let b = ''; try { b = (await r.text()); } catch (e) { } out.reqs.push(r.status() + ' ' + decodeURIComponent(r.url().replace(API, '')).slice(0, 400) + ' -> total=' + ((b.match(/"total_count":\d+/) || [''])[0])); } };
page.on('response', fr);
await page.goto(H + '/modules/' + L + '?view=' + V, { waitUntil: 'load', timeout: 90000 }); await sleep(20000);
out.ui = ((await txt()).match(/\d+ records?/) || [''])[0];
await shot('NDC-2095-view-today');
for (let k = 0; k < 2; k++) { await page.reload({ waitUntil: 'load' }); await sleep(15000); out['reload' + k] = ((await txt()).match(/\d+ records?/) || [''])[0]; }
page.off('response', fr); return done(out);
