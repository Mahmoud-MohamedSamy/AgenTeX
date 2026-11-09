// NDC-2203 retest 1 Nov — fix 1 (false "Permission denied." after a save), API, as the admin (not an agent of Customer Support, not on CES).
const out = {}; const AG = '9d182dfa-05f3-4af7-9685-8615a2fbe537', TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const s = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || '').slice(0, 90) : '');
const create = async (tag, extraVals, extraFields) => { const r = await api('POST', `/modules/${T}/records`, { data: [...Object.entries({ subject: `QA WF ${tag} ticket`, status: 'Open', department: CS, email: QA_EMAIL, channel: 'email', ...(extraVals || {}) }).map(([k, v]) => ({ field: k, value: enc(v) })), ...(extraFields || [])] });
  if (r.j?.data?.id) track('ticket', r.j.data.id, tag); return r; };
// a) Create rule → assign to team CES
out.ruleZ1 = (await mkRule('Z1', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }])).s;
const a = await create('Z1'); out.Z1_createWithTeamRule = s(a); out.Z1_id = a.j?.data?.id; out.Z1_body = a.s < 300 ? Object.keys(a.j?.data || {}).slice(0, 8) : undefined;
// b) no rule: owner = another agent
const b = await create('Z2', { owner: AG }); out.Z2_createOwnerOther = s(b); out.Z2_id = b.j?.data?.id;
// c) no rule: team, no owner
const c = await create('Z3', { team: TEAM }, [{ field: 'owner', value: { kind: 'null' } }]); out.Z3_createTeamNoOwner = s(c); out.Z3_id = c.j?.data?.id;
// d) Edit rule → assign to team; the admin's own edit moves the ticket out of view
out.ruleZ4 = (await mkRule('Z4', { kind: 'RecordUpdated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'Team', ownerValue: TEAM }])).s;
const d = await create('Z4'); out.Z4_create = s(d); out.Z4_id = d.j?.data?.id;
if (d.j?.data?.id) { await sleep(3000); const p = await api('PATCH', `/modules/${T}/records/${d.j.data.id}`, { data: [{ field: 'description', value: enc('QA WF Z4 edit') }] }); out.Z4_editMovedOut = s(p); }
// can the admin still open them? (expected: no — they left the admin's view)
for (const k of ['Z1', 'Z2', 'Z3', 'Z4']) if (out[k + '_id']) out[k + '_adminRead'] = (await api('GET', `/modules/${T}/records/${out[k + '_id']}`)).s;
return fin(out);
