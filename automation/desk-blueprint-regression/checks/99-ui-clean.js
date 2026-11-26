// Remove the Phase 3 fixture.
const FX = JSON.parse(fs.readFileSync(RUN + '/out/ui-fixture.json', 'utf8'));
const out = { t: 0, b: 0, fail: [] };
for (const id of Object.values(FX.bps)) { await api('POST', `/desk/blueprints/${id}/revoke`, { ticket_ids: null, after: null }); }
for (const id of Object.values(FX.tickets)) { const r = await api('DELETE', `/modules/${T}/records/${id}`); ok(r) || r.s === 404 ? out.t++ : out.fail.push('t ' + E(r)); }
await sleep(2000);
for (const id of Object.values(FX.bps)) { const r = await api('DELETE', `/modules/${T}/blueprints/${id}`); ok(r) || r.s === 404 ? out.b++ : out.fail.push('bp ' + E(r)); }
if (FX.sla) { const r = await api('DELETE', `/desk/sla/policies/${FX.sla}`); out.sla = r.s; }
return out;
