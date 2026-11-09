const out = {}; const AG = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
out.rule = await mkRule('Y4', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: AG }]);
const a = await api('POST', `/modules/${T}/records`, { data: Object.entries({ subject: 'QA WF Y4 ticket', status: 'Open', department: CS, email: QA_EMAIL, channel: 'email' }).map(([k, v]) => ({ field: k, value: enc(v) })) });
out.create = a.s + ' ' + (a.j?.error?.message || '');
// edit: own ticket, change owner to the agent directly (no rule)
const t = await mkTicket('Y5'); await sleep(2000);
const e = await api('PATCH', `/modules/${T}/records/${t.id}`, { data: [{ field: 'owner', value: enc(AG) }] }); out.editOwner = e.s + ' ' + (e.j?.error?.code || e.j?.error?.message || '');
out.y5 = t.id;
return fin(out);
