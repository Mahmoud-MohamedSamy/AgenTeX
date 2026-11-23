const DEV2 = '5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4'; const out = {};
for (const p of [`/desk/agents/${DEV2}`, `/desk/agents/${DEV2}/presence`, '/desk/agents/presence', `/desk/departments/${DEPT2}/agents`, '/desk/agents?department_id=' + DEPT2, '/desk/presence', '/desk/agents/online']) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.s < 300 ? (JSON.stringify(r.j?.data) || '').match(/.{0,60}5491656d.{0,220}/)?.[0] || (JSON.stringify(r.j?.data) || '').slice(0, 200) : ''); }
return out;
