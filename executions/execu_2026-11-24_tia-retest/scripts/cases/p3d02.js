const o = {}; const B = JSON.parse(fs.readFileSync(RUN + '/out/p3-baseline.json', 'utf8'));
let a = await getAgent(); o.kbDocs = a.draft_definition.kb_document_ids; o.undeployed = a.has_undeployed_changes;
const diff = Object.keys(a.draft_definition).filter(k => JSON.stringify(a.draft_definition[k]) !== JSON.stringify(B.agent.def[k])); o.changedKeys = diff;
for (const p of [`/agents/${a.id}/kb/documents`, `/agents/${a.id}/documents`, '/kb/documents', '/agents/kb/documents', '/ai/kb/documents']) { const r = await api('GET', p); if (r.s === 200) { o.docsEndpoint = p; o.docs = JSON.stringify(r.j?.data).slice(0, 400); break; } }
if (process.env.GO) {
  const dep = await api('POST', `/agents/${a.id}/deploy`, {}); o.deploy = dep.s + ' ' + (dep.j?.error?.code || ''); ledger('P3 D-02: KB document deployed (' + dep.s + ') — restore');
  await sleep(10000);
  for (const app of ['desk', 'crm']) { const r = await ask('What is the QA TIA P3 code word?', { page: { app } }); o[app] = { text: tiaText(r).slice(0, 300), citations: JSON.stringify(r.final?.citations || null).slice(0, 300) }; }
}
p3rec('D-02', '?', JSON.stringify(o).slice(0, 1400)); return o;
