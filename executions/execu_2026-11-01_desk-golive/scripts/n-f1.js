const o = {}; const S = r => ({ s: r.s, e: r.j && r.j.error ? (r.j.error.code + ': ' + r.j.error.message).slice(0, 200) : null });
const DA = '44444444-4444-4444-4444-444444444402'; const EM = 'mmohamed@anyware.software';
const rowsOf = async () => (await api('GET', '/iam/users?limit=200')).j.data.filter(x => x.email === EM).map(x => ({ email: x.email, status: x.status, userId: x.userId, invitationStatus: x.invitationStatus, invitationId: x.invitationId, profiles: x.profileNames }));
o.before = await rowsOf();
o.invite = S(await api('POST', '/iam/users/invite', { email: EM, profile_id: DA }));
o.after = await rowsOf();
await page.goto(H + '/settings/users-control/agents', { waitUntil: 'commit', timeout: 45000 }).catch(() => {}); let t = ''; for (let i = 0; i < 30; i++) { await sleep(1000); t = await txt().catch(() => ''); if (/All Agents/.test(t) && t.length > 900) break; }
const all = page.getByRole('tab', { name: /All Agents/ }); if (await all.count()) { await all.first().click().catch(() => {}); await sleep(3000); }
const sb = page.getByPlaceholder(/search/i).last(); if (await sb.count()) { await sb.fill('mmohamed@anyware'); await sleep(3500); }
await page.screenshot({ path: SHOT + '/bugs/W1-B3-2-agents-invited-row.png' }); o.ui = (await txt()).replace(/\s+/g, ' ').match(/All Agents.{0,500}/)?.[0];
// render the two API rows as a readable panel
const html = `<html><body style="margin:0;font:15px/1.5 Consolas,monospace;background:#0f172a;color:#e2e8f0;padding:24px;width:1552px"><div style="font:600 18px Segoe UI;margin-bottom:12px;color:#fff">GET /api/v1/iam/users?limit=200 — rows with email ${EM} (NDC-Staging, ${new Date().toISOString().slice(0,16)}Z)</div>` + o.after.map((r, i) => `<pre style="background:#1e293b;border-radius:6px;padding:12px;margin:0 0 12px;white-space:pre-wrap">row ${i + 1}: ${JSON.stringify({ ...r, invitationId: r.invitationId ? r.invitationId.slice(0, 8) + '…' : null, userId: r.userId.slice(0, 8) + '…' }, null, 1)}</pre>`).join('') + `</body></html>`;
const p2 = await page.context().newPage(); await p2.setViewportSize({ width: 1600, height: 900 }); await p2.setContent(html); await p2.screenshot({ path: SHOT + '/bugs/W1-B3-3-api-two-rows.png' }); await p2.close();
const pend = o.after.find(x => x.invitationStatus === 'pending' || x.status === 'Invited');
if (pend && pend.invitationId) { o.cancel = S(await api('POST', '/iam/users/invitations/' + pend.invitationId + '/cancel', {})); }
o.final = await rowsOf();
return done(o);
