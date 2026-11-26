const sh = r => ({ s: r.status, err: r.error || null, text: (r.text || r.final?.text || '').slice(0, 400), card: (r.final?.pending_actions || []).map(a => a.kind + ': ' + (a.summary || '').slice(0, 200)).join(' | ') || null });
const rej = async r => { for (const a of r.final?.pending_actions || []) await api('POST', `/agents/tia/actions/${a.id}/reject`, {}); };
const o = { variants: [] }; const convs = new Set();
const flows = [
  ['desk', ['i want you to create assignment rule']],
  ['crm', ['i want you to create assignment rule', 'leads module, name it QA TIA Sara check, assign all new leads round robin to the sales users']],
  ['crm', ['i want you to create assignment rule', 'for leads, assign every new lead to Sara']],
  ['crm', ['create an assignment rule for leads that assigns new leads to my team']],
];
for (const [app, turns] of flows) {
  let cid; const v = { app, turns: [] };
  for (const m of turns) { const r = await ask(m, { page: { app }, ...(cid ? { conversation_id: cid } : {}) }); cid = cid || r.final?.conversation_id; if (cid) convs.add(cid); v.turns.push({ m, ...sh(r) }); await rej(r); await sleep(6000); }
  o.variants.push(v);
}
for (const c of convs) await api('DELETE', `/agents/tia/conversations/${c}`);
o.qaRulesLeft = arr((await api('GET', '/workflow/rules?limit=300')).j?.data).filter(r => /QA TIA Sara/i.test(r.name || '')).length;
return o;
