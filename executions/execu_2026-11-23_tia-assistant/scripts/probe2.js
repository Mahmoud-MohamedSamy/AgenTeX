const out = {};
const id = '014e511f-cbc5-5fd8-b939-f58a84beef15';
for (const p of [`/agents/${id}`, `/agents/${id}/versions`, '/iam/profiles', '/iam/users?take=200&app_key=desk', '/iam/users?take=200', '/iam/permissions', '/agents/tia-setup-areas']) { const r = await api('GET', p); out[p] = { s: r.s, body: r.j ?? r.t.slice(0, 300) }; }
fs.writeFileSync(process.env.OUTF, JSON.stringify(out, null, 1));
return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.s]));
