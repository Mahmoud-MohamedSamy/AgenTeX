const L = []; const D = IDS.DA; const S = x => String(JSON.stringify(x === undefined ? null : x)).slice(0, 300);
L.push(R_('C-07', 'Pass', 'API accepts a target with kind agent + team_id but stores only the agent (team_id dropped): ticket → A1, no team'));
const H = async id => { const h = await hist(id); return Array.isArray(h) ? h.filter(x => /auto_assigned|owner_changed|workflow/.test(x)).map(x => x.slice(0, 120)) : h; };
// D-15: workflow sees the owner set by direct (condition owner = A1)
await mkRule({ type: 'direct', name: 'QA AR EO2 direct', description: 'QA', is_active: true, execute_on: ['create'], targets: [DT('QA AR EO2', D, null, AG(IDS.A1))] });
const w1 = await mkWf('QA AR WF EO2', 'RecordCreated', { kind: 'Logical', operator: 'And', operands: [SM('QA AR EO2'), { kind: 'Comparison', field: 'owner', operator: 'Equal', value: { kind: 'string', stringValue: IDS.A1 } }] }, [{ type: 'OwnerAssignment', order: 0, delaySeconds: 0, ownerTargetKind: 'User', ownerValue: IDS.A2 }]);
L.push({ wf1: w1.s, e: w1.e });
let id = (await mkTicket('QA AR EO2 x', D)).id; await sleep(10000);
L.push(R_('D-15', (await ownN(id)) === 'A2' ? 'Pass' : 'Fail', 'Direct → A1, then workflow "owner is A1 → set A2" in the same event: final owner ' + await ownN(id) + ' (A2 means the workflow saw the direct owner). History ' + S(await H(id))));
// D-16: direct then workflow sets other owner -> final workflow owner, history both
await mkRule({ type: 'direct', name: 'QA AR EO5 direct', description: 'QA', is_active: true, execute_on: ['create'], targets: [DT('QA AR EO5', D, null, AG(IDS.A1))] });
const w2 = await mkWf('QA AR WF EO5', 'RecordCreated', SM('QA AR EO5'), [{ type: 'OwnerAssignment', order: 0, delaySeconds: 0, ownerTargetKind: 'User', ownerValue: IDS.A2 }]);
id = (await mkTicket('QA AR EO5 x', D)).id; await sleep(10000); const h5 = await H(id);
L.push(R_('D-16', (await ownN(id)) === 'A2' ? 'Pass' : 'Fail', 'Direct → A1, workflow sets A2: final owner ' + await ownN(id) + '; history ' + S(h5)));
// D-17: workflow sets owner, matching RR does nothing
const w3 = await mkWf('QA AR WF EO3', 'RecordCreated', SM('QA AR F EO3'), [{ type: 'OwnerAssignment', order: 0, delaySeconds: 0, ownerTargetKind: 'User', ownerValue: IDS.A3 }]);
id = (await mkTicket('QA AR F EO3 x', D)).id; await sleep(10000); const h3 = await H(id);
L.push(R_('D-17', (await ownN(id)) === 'A3' && !h3.some(x => /round_robin/.test(x)) ? 'Pass' : 'Fail', 'Workflow sets A3 on create; Dept A RR "QA AR F seq" also matches: final owner ' + await ownN(id) + '; history ' + S(h3)));
return L;
