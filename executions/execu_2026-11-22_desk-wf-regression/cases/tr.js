// TR-03..TR-11 record-action triggers (API sources)
const out = {};
// rules
const rC = await mkRule('TRC', { kind: 'RecordCreated' }, [FU({ classification: 'Problem' })]);
const rE = await mkRule('TRE', { kind: 'RecordUpdated' }, [FU({ classification: 'Problem' })]);
const rCE = await mkRule('TRCE', { kind: 'RecordCreatedOrUpdated' }, [FU({ classification: 'Problem' })]);
const h = await hook();
const rD = await mkRule('TRD', { kind: 'RecordDeleted' }, [WH(h, '{"deleted":"${subject}","p":"${priority}"}')]);
out.save = { C: rC.s, E: rE.s, CE: rCE.s, D: rD.s, Derr: rD.err };
// TR-03: On Create fires once on create; not on edit / comment / delete
const t1 = await mkTicket('TRC'); await waitTicket(t1.id, x => x.classification === 'Problem' || x.classification === 'problem', 40);
await patchTicket(t1.id, { priority: 'high' }); await comment(t1.id, false);
await sleep(20000); out.TR03 = { firedC: await fired(t1.id, rC.id), cls: (await getTicket(t1.id)).classification };
// TR-04/05: On Edit not on create, fires on PATCH once
const t2 = await mkTicket('TRE'); await sleep(20000); const before = await fired(t2.id, rE.id);
await patchTicket(t2.id, { priority: 'high' }); await waitFor(async () => (await fired(t2.id, rE.id)) > 0, 40);
out.TR05 = { onCreate: before }; out.TR04 = { afterEdit: await fired(t2.id, rE.id) };
// TR-06 same value save
await sleep(5000); const n1 = await fired(t2.id, rE.id); await patchTicket(t2.id, { priority: 'high' }); await sleep(20000); out.TR06 = { before: n1, after: await fired(t2.id, rE.id) };
// TR-07 create or edit
const t3 = await mkTicket('TRCE'); await waitFor(async () => (await fired(t3.id, rCE.id)) > 0, 40); const c1 = await fired(t3.id, rCE.id);
await patchTicket(t3.id, { priority: 'low' }); await waitFor(async () => (await fired(t3.id, rCE.id)) > c1, 40); out.TR07 = { create: c1, afterEdit: await fired(t3.id, rCE.id) };
// TR-11 close / reopen = edit
await patchTicket(t2.id, { status: 'Closed' }); await sleep(15000); const k1 = await fired(t2.id, rE.id);
await patchTicket(t2.id, { status: 'Open' }); await sleep(15000); out.TR11 = { afterClose: k1, afterReopen: await fired(t2.id, rE.id), statusNow: (await getTicket(t2.id)).status };
// TR-08 delete
const t4 = await mkTicket('TRD', { priority: 'urgent' }); await sleep(5000); const d = await delTicket(t4.id);
const got = await waitHook(h, 1, 60); out.TR08 = { del: d.s, hook: got ? got.map(x => x.content).slice(0, 2) : 'none', exec: (await execs(t4.id, rD.id)).map(outcome) };
out.ids = { rC: rC.id, rE: rE.id, rCE: rCE.id, rD: rD.id, t1: t1.id, t2: t2.id, t3: t3.id, t4: t4.id };
fs.writeFileSync(RUN + '/out/tr.json', JSON.stringify(out, null, 1));
return out;
