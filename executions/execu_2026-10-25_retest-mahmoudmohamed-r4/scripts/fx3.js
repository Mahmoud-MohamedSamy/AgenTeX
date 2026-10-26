const M = { contacts: '6f553963-01d6-4b68-9fb3-143d23044c41', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430' };
const out = {};
for (const [k, id] of Object.entries(M)) {
  if (k !== 'deals') { const v = (await api('GET', `/modules/${id}/list-preferences`)).j.data.version; await api('PUT', `/modules/${id}/list-preferences`, { prefs: { lastView: 'list', pageSize: 25, hiddenKeys: [], visibleKeys: [] }, version: v }); }
  await page.goto(H + `/modules/${id}`, { waitUntil: 'commit', timeout: 120000 }); let t = ''; for (let i = 0; i < 90; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/[1-9][\d,]* records|Something went wrong/.test(t)) break; }
  out[k] = /Something went wrong/.test(t) ? 'CRASH' : (t.match(/\d[\d,]* records/) || ['?'])[0];
}
await page.goto(H + '/workqueue/activities/tasks', { waitUntil: 'commit', timeout: 120000 }); let t = ''; for (let i = 0; i < 60; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/Total Records|Something went wrong/.test(t)) break; } out.workqueue = /Something went wrong/.test(t) ? 'CRASH' : (t.match(/Total Records \d+/) || ['?'])[0];
return done(out);
