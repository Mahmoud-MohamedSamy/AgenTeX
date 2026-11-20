const L = []; const D = IDS.DA;
const j = await agentGet('a1', '/notifications?limit=5'); L.push({ shape: j && Object.keys(j), sample: JSON.stringify(arr(j && j.data)[0] || j).slice(0, 400) });
// G-01: rule assigns A1 (direct D01 rule active)
const t1 = await mkTicket('QA AR D01 notify', D); // G-03 team target
const t3 = await mkTicket('QA AR D05 notify team', D); // G-06 no owner change: update a ticket owned by A1 without touching owner
const t6 = await mkTicket('QA AR G06 plain', D, { owner: IDS.A1 }); await sleep(3000); await patchT(t6.id, { priority: 'Low' });
// G-02: A1 picks up an unassigned ticket himself
const t2 = await mkTicket('QA AR G02 pickup', D); await sleep(3000); const pu = await agentDo('a1', 'POST', '/desk/tickets/' + t2.id + '/pick-up', {});
await sleep(20000);
const n = async (who, id) => (await notifFor(who, id)).length;
const g1 = { a1: await n('a1', t1.id), a2: await n('a2', t1.id) }; const g3 = { a1: await n('a1', t3.id), a2: await n('a2', t3.id) }; const g6 = { a1: await n('a1', t6.id) }; const g2 = { a1: await n('a1', t2.id), owner: await ownN(t2.id), pickup: pu.slice(0, 80) };
L.push({ g1, g2, g3, g6 });
L.push(R_('G-01', g1.a1 === 1 && g1.a2 === 0 ? 'Pass' : 'Fail', 'Direct rule assigns A1: notifications A1 ' + g1.a1 + ', A2 ' + g1.a2));
L.push(R_('G-02', g2.owner === 'A1' && g2.a1 === 0 ? 'Pass' : 'Fail', 'A1 picks up a ticket himself (' + g2.pickup + '): owner ' + g2.owner + ', A1 notifications ' + g2.a1));
L.push(R_('G-03', g3.a2 === 1 && g3.a1 === 0 ? 'Pass' : 'Fail', 'Direct rule → team QA AS6 Team A (A2, A3): A2 notifications ' + g3.a2 + ', A1 (not in team) ' + g3.a1));
L.push(R_('G-06', g6.a1 === 0 ? 'Pass' : 'Fail', 'Ticket created with owner A1 then edited (no owner change): A1 assignment notifications ' + g6.a1 + ' (created-with-owner may notify once)'));
return L;
