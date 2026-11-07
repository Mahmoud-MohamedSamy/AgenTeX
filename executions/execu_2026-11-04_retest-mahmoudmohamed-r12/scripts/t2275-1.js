const Z = require("./p2275.js")({api, X, sleep, arr, ledger, log}); const o = {}; const { U, A, cond } = Z;
const cs = await Z.rules('round_robin', X.ids.DEPT_CS); o.csMethods = cs.map(r => r.targets.map(t => t.method).join(','));
const da = await Z.mkRule({ type: 'direct', department_id: null, name: 'DA1', targets: [{ criteria: { conditions: [cond('subject', 'contains', 'QA RT12 2275 DA1')], pattern: null }, coming_to_department_id: A, move_to_department_id: null, assign: { kind: 'agent', user_id: U.A1, team_id: null } }] });
o.da = X.err(da); o.daId = da.j?.data?.id; if (!o.daId) { o.daBody = da.t.slice(0, 800); return o; }
const rr = await Z.mkRule({ type: 'round_robin', department_id: A, name: 'RR1', targets: [
  { criteria: { conditions: [cond('subject', 'contains', ' SEQ')], pattern: null }, method: 'sequential', pool: { kind: 'agents', user_ids: [U.A1, U.A2, U.A3], team_id: null, excluded_user_ids: [] } },
  { criteria: { conditions: [cond('subject', 'contains', ' LOAD')], pattern: null }, method: 'load', pool: { kind: 'agents', user_ids: [U.A1, U.A2, U.A3], team_id: null, excluded_user_ids: [] } }] });
o.rr = X.err(rr); o.rrId = rr.j?.data?.id; if (!o.rrId) { o.rrBody = rr.t.slice(0, 800); return o; }
const t1 = await Z.tk('DA1 a'); o.T1 = await Z.waitOwner(t1);
const t2 = await Z.tk('DA1 b preset owner', { owner: U.O }); await sleep(8000); o.T2 = await Z.owner(t2);
const t3 = await Z.tk('DA1 SEQ c'); o.T3 = await Z.waitOwner(t3);
o.T4 = []; for (let i = 1; i <= 6; i++) { const t = await Z.tk('SEQ ' + i); o.T4.push((await Z.waitOwner(t)).owner); }
o.ids = { t1, t2, t3 };
return o;
