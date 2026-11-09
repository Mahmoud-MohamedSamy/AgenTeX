// NDC-2420 / 2659 run: lead enters the QA blueprint at "web"; t0 (no fields) then t1 (required Email); check executions, fields, owner.
const out = {}; const R1 = 'fd8087d4', R2 = '51b597bc';
const L = await X.lead('o', 'QA RT r10 2420 lead ' + (process.env.N || 'a'), { lead_source: 'web', email: 'qa.r10.2420' + (process.env.N || 'a') + '@example.com' });
const id = L.j?.data?.id; out.lead = L.s + ' ' + (id || L.t.slice(0, 300)); if (!id) return out;
await X.waitFor(30, async () => (await X.bpState('o', T.LEADS, id))?.transitions?.length > 0);
const offered = async () => ((await X.bpState('o', T.LEADS, id))?.transitions || []).map(t => t.transitionId || t.id);
out.offered0 = await offered();
const t0 = out.offered0.find(t => String(t).includes('t0'));
const ex0 = (await X.executions(id)).length;
const a = await api('o', 'POST', `/modules/${T.LEADS}/records/${id}/blueprint-transitions/${t0}`, {}); out.t0 = a.s + ' ' + (a.s > 299 ? a.t.slice(0, 300) : '');
out.afterT0 = { source: await X.field('o', T.LEADS, id, 'lead_source') };
await X.waitFor(120, async () => (await X.field('o', T.LEADS, id, 'description')) === 'QA r10 R1 ran');
out.afterT0.description = await X.field('o', T.LEADS, id, 'description');
const e1 = await X.executions(id); out.execAfterT0 = e1.map(e => [String(e.ruleId || e.assignmentRuleId).slice(0, 8), e.triggerKind, e.outcome, e.evaluatedAt, JSON.stringify(e.actionResults || e.actions || '').slice(0, 300)]);
out.offered1 = await offered();
const t1 = out.offered1.find(t => String(t).includes('t1'));
const noField = await api('o', 'POST', `/modules/${T.LEADS}/records/${id}/blueprint-transitions/${t1}`, {}); out.t1empty = noField.s + ' ' + noField.t.slice(0, 200);
let b = noField; if (noField.s > 299) { b = await api('o', 'POST', `/modules/${T.LEADS}/records/${id}/blueprint-transitions/${t1}`, { email: 'qa.r10.2420' + (process.env.N || 'a') + '.t1@example.com' }); out.t1 = b.s + ' ' + (b.s > 299 ? b.t.slice(0, 300) : ''); }
if (b.s > 299) { const c = await api('o', 'POST', `/modules/${T.LEADS}/records/${id}/blueprint-transitions/${t1}`, { fields: { email: 'qa.r10.2420t1@example.com' } }); out.t1fields = c.s + ' ' + c.t.slice(0, 300); }
await X.waitFor(120, async () => { const r = await api('o', 'GET', `/modules/${T.LEADS}/records/${id}`); return r.j?.data?.owner_id === T.U1 || r.j?.data?.ownerId === T.U1; });
const rec = (await api('o', 'GET', `/modules/${T.LEADS}/records/${id}`)).j?.data;
out.afterT1 = { source: await X.field('o', T.LEADS, id, 'lead_source'), owner: rec?.owner_id || rec?.ownerId, ownerIsU1: (rec?.owner_id || rec?.ownerId) === T.U1, status: await X.field('o', T.LEADS, id, 'lead_status'), email: await X.field('o', T.LEADS, id, 'email') };
const e2 = await X.executions(id); out.execAll = e2.map(e => [String(e.ruleId || e.assignmentRuleId).slice(0, 8), e.triggerKind, e.outcome, e.evaluatedAt, JSON.stringify(e.actionResults || e.actions || '').slice(0, 300)]);
out.execKeys = e2[0] && Object.keys(e2[0]);
out.id = id; return out;
