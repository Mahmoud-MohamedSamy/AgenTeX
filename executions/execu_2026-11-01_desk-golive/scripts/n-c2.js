const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : null });
await page.goto(H + '/settings/users-control/agents', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); let t = ''; for (let i = 0; i < 30; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/All Agents/.test(t) && t.length > 900) break; }
const all = page.getByRole('tab', { name: /All Agents/ }); if (await all.count()) { await all.first().click().catch(() => {}); await sleep(3000); }
const sb = page.getByPlaceholder(/search/i).last(); if (await sb.count()) { await sb.fill('mmohamed@anyware'); await sleep(3000); }
await page.screenshot({ path: SHOT + '/bugs/W1-B3-1-agents-two-rows.png' }); o.uiRows = (await txt()).replace(/\s+/g, ' ').match(/All Agents.{0,700}/)?.[0];
o.cancel = S(await api('POST', '/iam/users/invitations/7d04cd75-3226-4d57-83b3-c46d83f452b5/cancel', {}));
const rows = (await api('GET', '/iam/users?limit=200')).j.data.filter(x => x.email === 'mmohamed@anyware.software'); o.after = rows.map(x => x.status + ':' + x.profileNames);
return done(o);
