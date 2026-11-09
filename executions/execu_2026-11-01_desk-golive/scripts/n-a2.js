const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : null });
// W1-58 edit + UI + delete
o.sigEdit = S(await api('PUT', '/mail/signatures/me', { department_id: null, body_html: '<p>QA GL N signature edited</p>' }));
await page.goto(H + '/profile', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/QA GL N signature edited/.test(t) || t.length > 1500) break; }
o.uiProfileHasSig = /QA GL N signature edited/.test(t);
// try signatures tab
const tab = page.getByRole('tab', { name: /signature/i }); if (await tab.count()) { await tab.first().click().catch(() => {}); await sleep(3000); t = await txt().catch(() => ''); o.uiSigTab = /QA GL N signature edited/.test(t); o.sigTabText = t.replace(/\s+/g, ' ').slice(-400); }
o.sigDel = S(await api('DELETE', '/mail/signatures/me'));
const g = await api('GET', '/mail/signatures/me'); o.sigAfter = JSON.stringify(g.j && g.j.data).slice(0, 200);
// W1-51 discover status field
const f = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/fields'); const fs = (f.j && (f.j.data || f.j)) || []; const fl = Array.isArray(fs) ? fs : (fs.fields || fs.items || []);
const st = fl.find(x => (x.apiName || x.key || x.name) === 'status' || /^status$/i.test(x.label || x.displayName || ''));
o.statusField = st ? JSON.stringify(st).slice(0, 900) : 'not found; keys ' + JSON.stringify(fl.slice(0, 2)).slice(0, 300);
return done(o);
