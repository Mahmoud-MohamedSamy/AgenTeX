const T='88e8ea44-1658-4df3-9930-d0902b91073d', TK='d120a6c2-2596-4254-968b-a1bcd3a000bf', CT='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const out = { del: {}, fail: [] }; const D = async (k, p) => { const r = await api('DELETE', p); out.del[k] = (out.del[k] || 0) + (r.s < 300 ? 1 : 0); if (r.s >= 300) out.fail.push(k + ' ' + p + ' ' + r.s + ' ' + r.t.slice(0, 120)); };
for (const id of ['13676fb2-97f3-4691-b7bd-9311eb605948','6f30ae62-4817-4d5d-996a-e67b0b4c5816','209c4d45-25fa-47f0-8520-2e14da89c48c','222cb914-34c6-4b38-8049-c367c3bdd58f']) await D('tickets', '/modules/'+T+'/records/'+id);
await D('tasks', '/modules/'+TK+'/records/51e64f8c-13dc-4f96-a1f9-cf0a103ad1ce');
for (const f of ['out/QA_RT16_2845_small.json','out/QA_RT16_2845_big.json']) for (const id of JSON.parse(fs.readFileSync(f))) await D('contacts', '/modules/'+CT+'/records/'+id);
await D('department', '/desk/departments/777f6164-904d-4a73-a964-8eb6dbfa9961');
return out;
