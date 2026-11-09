const out = {}; const AG = '9d182dfa-05f3-4af7-9685-8615a2fbe537', TEAM = '1adfefb7-0c25-4484-ae92-782964695054';
const s = r => r.s + (r.s >= 300 ? ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || '').slice(0, 80) : '');
// a) rule assigns the new ticket to another agent (user), no team
out.ruleUser = await mkRule('Y1', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'User', ownerValue: AG }]);
const a = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA WF Y1 ticket', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }).map(([k, v]) => ({ field: k, value: enc(v) })) }); out.a_createUserRule = s(a);
// b) no rule: create directly with owner = another agent
const b = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA WF Y2 ticket', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email', owner: AG }).map(([k, v]) => ({ field: k, value: enc(v) })) }); out.b_createOwnerOther = s(b);
// c) no rule: create directly with team, no owner
const c = await api('POST', `/modules/${T}/records`, { data: [...Object.entries({ subject: 'QA WF Y3 ticket', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email', team: TEAM }).map(([k, v]) => ({ field: k, value: enc(v) })), { field: 'owner', value: { kind: 'null' } }] }); out.c_createTeamNoRule = s(c);
// d) after (b)/(c): can the admin read them / list them?
for (const [k, r] of [['b', b], ['c', c]]) if (r.j?.data?.id) { track('ticket', r.j.data.id, 'Y'); out['read_' + k] = (await api('GET', `/modules/${T}/records/${r.j.data.id}`)).s; }
// e) admin permissions relevant to tickets
const p = (await api('GET', '/iam/me/permissions')).j?.data; const keys = (Array.isArray(p) ? p : p?.permissions || []).map(x => typeof x === 'string' ? x : x.key || x.permission_key).filter(k => /ticket|desk\.record|view_all|records\./i.test(k || ''));
out.perms = keys.slice(0, 40);
return fin(out);
