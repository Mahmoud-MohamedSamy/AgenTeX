const M = { contacts: '6f553963-01d6-4b68-9fb3-143d23044c41', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3' };
const out = {};
for (const [k, id] of Object.entries(M)) { await page.goto(H + `/modules/${id}`, { waitUntil: 'commit', timeout: 120000 }); let t = ''; for (let i = 0; i < 100; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/\d[\d,]* records|Something went wrong/.test(t) && !/Loading/.test(t)) break; } out[k] = { crashed: /Something went wrong/.test(t), count: (t.match(/\d[\d,]* records/) || [])[0], prefs: JSON.stringify((await api('GET', `/modules/${id}/list-preferences`)).j?.data).slice(0, 120) }; }
return done(out);
