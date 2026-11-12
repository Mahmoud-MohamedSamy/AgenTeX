const a = JSON.parse(fs.readFileSync('../a4/agent.json')); const AG = 'e862a437-3cb3-4a99-a98b-2884eae7e570';
const R = { sameAsInvite: a.uid === AG };
const rule = await mkRule('I9 owner', { kind: 'RecordCreated' }, [{ type: 'OwnerAssignment', ownerTargetKind: 'SpecificUser', ownerValue: AG }]); R.rule = rule.s + (rule.err || '');
fs.writeFileSync('../a4/i9-out.json', JSON.stringify({ rule: rule.id, AG }));
const t = await mkTicket('I9 owner', {}, 'active control'); await sleep(15000);
const g = await getTicket(t.id); R.ctrl = { owner: g.owner === AG || g.owner_id === AG || JSON.stringify(g).includes(AG), ex: (await execs(t.id)).filter(e => e.rule === rule.id) };
fs.writeFileSync('../a4/i9-out.json', JSON.stringify({ rule: rule.id, AG, ctrl: t.id }));
log(JSON.stringify(R));
