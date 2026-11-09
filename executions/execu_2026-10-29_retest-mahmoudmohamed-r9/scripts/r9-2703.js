// NDC-2703: record-lock rules on Leads. (a) nonsense condition must be refused; (b) a rule matching a QA lead must stop edits
// by the owner and by a CRM user. Rules deleted at the end of this script.
const out = {}; const B = `/modules/${T.LEADS}/record-locks`; const made = [];
const ex = arr((await api('o', 'GET', B)).j?.data); out.existing = ex.map(x => JSON.stringify(x).slice(0, 300)).slice(0, 3);
try {
  const bad = await api('o', 'POST', B, { name: 'QA RT 2703 bad', condition: 'zz not a condition !!' }); out.bad = bad.s + ' ' + bad.t.slice(0, 250); if (bad.j?.data?.id) made.push(bad.j.data.id);
  const C = { conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA RT 2703 LK' }], pattern: '' };
  let ok = await api('o', 'POST', B, { name: 'QA RT 2703 lock', condition: C }); out.goodObj = ok.s + ' ' + ok.t.slice(0, 200);
  if (ok.s > 299) ok = await api('o', 'POST', B, { name: 'QA RT 2703 lock', condition: JSON.stringify(C) }); out.good = ok.s + ' ' + ok.t.slice(0, 300); if (ok.j?.data?.id) made.push(ok.j.data.id);
  if (ok.j?.data?.id) {
    out.stored = JSON.stringify((await api('o', 'GET', `${B}/${ok.j.data.id}`)).j?.data || arr((await api('o', 'GET', B)).j?.data).find(x => x.id === ok.j.data.id)).slice(0, 400);
    const l = (await X.lead('u1', 'QA RT 2703 LK lead')).j?.data?.id; out.lead = l; await sleep(4000);
    const ed = async (who, v) => { const r = await api(who, 'PATCH', `/modules/${T.LEADS}/records/${l}`, { data: [{ field: 'description', value: { kind: 'string', value: v } }] }); return r.s + ' ' + (r.j?.error?.code || '') + ' ' + (r.j?.error?.message || '').slice(0, 120); };
    out.editOwner = await ed('o', 'QA RT 2703 owner edit'); out.editU1 = await ed('u1', 'QA RT 2703 u1 edit');
    out.descNow = await X.field('o', T.LEADS, l, 'description');
    const ctl = (await X.lead('u1', 'QA RT 2703 control')).j?.data?.id; out.controlEdit = (await api('u1', 'PATCH', `/modules/${T.LEADS}/records/${ctl}`, { data: [{ field: 'description', value: { kind: 'string', value: 'ok' } }] })).s;
  }
} finally { out.deleted = []; for (const id of made) out.deleted.push((await api('o', 'DELETE', `${B}/${id}`)).s); }
return out;
