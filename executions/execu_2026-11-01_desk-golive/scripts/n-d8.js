const o = {}; const T = '88e8ea44-1658-4df3-9930-d0902b91073d', TK = 'd564fa1f-7b42-4710-94ab-e49de784519a';
o.me = (await api('GET', '/iam/me')).j.data.email;
const g = await api('GET', '/modules/' + T + '/records/' + TK); o.read = g.s; o.prio = ((g.j && g.j.data && g.j.data.data) || []).find(x => x.field === 'priority');
const p = await api('PATCH', '/modules/' + T + '/records/' + TK, { data: [{ field: 'priority', value: { kind: 'string', value: 'Low' } }] }); o.patch = p.s + ' ' + JSON.stringify(p.j && p.j.error).slice(0, 200);
const g2 = await api('GET', '/modules/' + T + '/records/' + TK); o.prioAfter = (((g2.j && g2.j.data && g2.j.data.data) || []).find(x => x.field === 'priority') || {}).value;
await page.goto(H + '/views/all/tickets/' + TK, { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/Shared with your department/i.test(t)) break; }
o.banner = (t.match(/Shared with your department[^.]*\.[^.]*\./) || [])[0]; o.shot = await shot('ndc/NDC-2303-sup-' + (globalThis.__LVL || 'ro'));
return done(o);
