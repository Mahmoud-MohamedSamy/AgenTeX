const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', MKT = '2a73bbc0-efb3-4250-bf9b-2fdc98236794', SAL = 'ef8dc91f-1d30-491d-a1fc-9b62b96eca94', HR = '08fd8684-c5c0-4d4d-86f9-2be70cf61e53';
const U = { B: '3445ec4a-020e-4f12-b156-dd2de7610164', C: '9d182dfa-05f3-4af7-9685-8615a2fbe537', D: '876ce871-2b02-4854-89a7-68050391c62b', E: '23f0f9d7-2fc0-429b-9334-9933fe5c429b' };
for (const [n, id] of Object.entries({ CS, MKT, SAL, HR })) { const r = await api('GET', '/desk/departments/' + id); out[n] = { s: r.s, keys: Object.keys(D(r.j) || {}), j: JSON.stringify(D(r.j)).slice(0, 900) }; const a = await api('GET', '/desk/departments/' + id + '/agents?limit=100'); out[n].ag = a.s + ' ' + a.t.slice(0, 900); }
for (const [n, id] of Object.entries(U)) { const r = await api('GET', '/desk/agents/' + id); out['u' + n] = r.s + ' ' + r.t.slice(0, 700); }
const q = await api('POST', '/desk/agents/departments/query', { agent_ids: Object.values(U), user_ids: Object.values(U) }); out.q = q.s + ' ' + q.t.slice(0, 900);
const r = await findT('QA GL'); out.rec = r[0] ? Object.keys(r[0]) : [];
return fin({ out });
