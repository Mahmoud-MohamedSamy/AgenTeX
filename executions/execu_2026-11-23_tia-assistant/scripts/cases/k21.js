const out = {};
const r = await api('GET', '/agents/tia/turns/00000000-0000-0000-0000-000000000000'); out.turn = JSON.stringify(r.j?.data);
return out;
