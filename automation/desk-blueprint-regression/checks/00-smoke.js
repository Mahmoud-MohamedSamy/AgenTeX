// Smoke: shapes work end to end (create, enter, list transitions as owner + agents, run, history). No verdicts recorded.
const tag = 'SMK' + uid();
const b = await mkBp(BASIC(tag));
const out = { create: E(b.r) };
const g = await getBp(b.id); out.revision = g?.revision; out.storedKeys = Object.keys(g?.definition || {});
const t = await mkT(tag); out.ticket = !!t;
const s = await waitIn(t); out.entered = st(s); out.stateKeys = s ? Object.keys(s) : null;
out.ownerSees = await transIds(t);
out.aSees = await transIds(t, A); out.bSees = await transIds(t, B);
const r = await runT(t, 'go', 'Open'); out.run = E(r); out.runResult = r.j?.data;
await sleep(2000); out.after = st(await bstate(t)); out.status = await statusOf(t);
out.hist = (await histTxt(t)).slice(0, 600);
out.sampleTicketFields = Object.keys(await flds(t)).slice(0, 40);
out.clean = await cleanup();
return out;
