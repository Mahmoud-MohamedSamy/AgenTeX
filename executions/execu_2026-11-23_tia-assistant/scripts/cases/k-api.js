const API = 'https://staging-desk.taviportal.com/api/v1'; const out = {};
const raw = async (p, o) => { try { const r = await fetch(API + p, o); return { s: r.status, h: Object.fromEntries([...r.headers].filter(([k]) => /access-control|content-type/.test(k))), t: (await r.text()).slice(0, 160) }; } catch (e) { return { s: 0, e: e.message }; } };
const H0 = { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004' };
out.A14 = {}; for (const p of ['/agents/tia/status', '/agents/tia/conversations', '/agents/tia/capabilities']) out.A14[p] = (await raw(p, { headers: H0 })).s;
out.A14.turn = (await raw('/agents/tia/turn/stream', { method: 'POST', headers: H0, body: JSON.stringify({ message: 'hi', turn_id: 'x' }) })).s;
out.K18 = {}; for (const [k, m] of Object.entries({ num: 42, arr: ['hi'], obj: { text: 'hi' }, empty: '', nul: null })) { const r = await stream('/agents/tia/turn/stream', { turn_id: crypto.randomUUID(), message: m }); out.K18[k] = r.status + ' ' + (r.error || r.j?.error?.code || '') + ' ' + (r.text || '').slice(0, 40); }
out.K19 = { action: (await api('GET', '/agents/tia/actions/00000000-0000-0000-0000-000000000000')).s, actionConfirm: (await api('POST', '/agents/tia/actions/00000000-0000-0000-0000-000000000000/confirm', {})).s, conv: (await api('GET', '/agents/tia/conversations/11111111-1111-1111-1111-111111111111/messages')).s, turn: (await api('GET', '/agents/tia/turns/00000000-0000-0000-0000-000000000000')).s };
out.K20 = await raw('/agents/tia/status', { method: 'OPTIONS', headers: { Origin: 'https://evil.example.com', 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization,x-tenant-id' } });
out.K20get = (await raw('/agents/tia/status', { headers: { ...H0, Origin: 'https://evil.example.com' } })).h;
out.K21 = (await api('GET', '/agents/tia/conversations', undefined)).s;
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
return out;
