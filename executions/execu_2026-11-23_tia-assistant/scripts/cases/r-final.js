const id = '44444444-4444-4444-4444-444444444402';
const d = await api('DELETE', `/iam/profiles/${id}/permissions/${encodeURIComponent('ai:tia:use')}`);
const perms = arr((await api('GET', `/iam/profiles/${id}/permissions`)).j?.data).map(x => x.permissionKey + ':' + x.effect).sort();
const before = JSON.parse(fs.readFileSync(RUN + '/out/p03-profiles.json', 'utf8'))['Desk Agent|desk'].body.data.map(x => x.permissionKey + ':' + x.effect).sort();
const base = JSON.parse(fs.readFileSync(RUN + '/out/baseline-run-desk.json', 'utf8'));
const now = {}; for (const p of Object.keys(base)) { const r = await api('GET', p); now[p] = { s: r.s, body: r.j ?? null }; }
fs.writeFileSync(RUN + '/out/final-run-desk.json', JSON.stringify(now, null, 1));
const a0 = base['/agents/014e511f-cbc5-5fd8-b939-f58a84beef15'].body.data, a1 = now['/agents/014e511f-cbc5-5fd8-b939-f58a84beef15'].body.data;
const pol0 = base['/ai/policy'].body.data.descriptor, pol1 = now['/ai/policy'].body.data.descriptor;
const rs0 = base['/agents/runtime-settings'].body.data, rs1 = now['/agents/runtime-settings'].body.data;
const strip = o => { const c = { ...o }; delete c.version; return c; };
const w0 = base['/ai/credits/wallet'].body.data, w1 = now['/ai/credits/wallet'].body.data;
return {
  R03: { del: d.s, profileEqualsP03: JSON.stringify(perms) === JSON.stringify(before) },
  R01: { definitionEqual: JSON.stringify(a0.draft_definition) === JSON.stringify(a1.draft_definition), descriptionEqual: a0.description === a1.description, status: a1.status, version: `${a0.deployed_version_no}→${a1.deployed_version_no}`, undeployed: a1.has_undeployed_changes },
  R04: { policyEqual: JSON.stringify(pol0) === JSON.stringify(pol1), policyVersion: `${base['/ai/policy'].body.data.version}→${now['/ai/policy'].body.data.version}`, runtimeEqual: JSON.stringify(strip(rs0)) === JSON.stringify(strip(rs1)), runtimeVersion: `${rs0.version}→${rs1.version}` },
  R05: { allStatus200: Object.values(now).every(x => x.s === 200), walletDebit: w1.lifetime_debited_credits - w0.lifetime_debited_credits, displayCredits: ((w1.lifetime_debited_credits - w0.lifetime_debited_credits) / 2000).toFixed(1), ownChats: arr(now['/agents/tia/conversations'].body?.data).map(c => c.id.slice(0, 8)) }
};
