const o = { runs: [] };
for (let i = 0; i < 3; i++) { const r = await ask('i want you to create assignment rule', { page: { app: 'crm' } }); o.runs.push({ err: r.error || null, s: r.status, text: (r.text || r.final?.text || '').slice(0, 250), card: (r.final?.pending_actions || []).map(a => a.kind + ': ' + (a.summary || '').slice(0, 150)).join(' | ') || null, conv: r.final?.conversation_id }); for (const a of r.final?.pending_actions || []) await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); await sleep(8000); }
const u = arr((await api('GET', '/iam/users?limit=500&app_key=crm')).j?.data); o.usersNamedSara = u.filter(x => /sara/i.test((x.display_name || x.name || x.full_name || '') + ' ' + (x.first_name || ''))).length; o.usersTotal = u.length;
for (const r of o.runs) if (r.conv) await api('DELETE', `/agents/tia/conversations/${r.conv}`);
return o;
