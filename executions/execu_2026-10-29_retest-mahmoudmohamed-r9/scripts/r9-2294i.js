// NDC-2294 item 3 run: an "On Note Added" rule sets Description when a note is added to a QA lead.
const out = {}; const G = 'QA RT 2294 ';
const w = await X.made('o', '/workflow/rules', X.wf(T.LEADS, G + 'item3 note trigger', G + 'NOTE', { trigger: 'NoteAdded', actions: [X.fieldUpdate('description', 'QA RT note rule ran')] }), 'workflow rule');
out.create = w.s; if (!w.j?.data?.id) return { ...out, t: w.t.slice(0, 300) };
out.activate = (await api('o', 'POST', `/workflow/rules/${w.j.data.id}/activate`)).s;
try {
  const l = (await X.lead('o', G + 'NOTE lead')).j?.data?.id; out.lead = l; await sleep(8000);
  out.beforeNote = await X.field('o', T.LEADS, l, 'description') ?? '(empty)';
  let n = await api('o', 'POST', `/modules/${T.LEADS}/records/${l}/notes`, { body: 'QA RT 2294 note' }); out.note = n.s + ' ' + (n.s > 299 ? n.t.slice(0, 300) : '');
  if (n.s > 299) { n = await api('o', 'POST', `/modules/${T.LEADS}/records/${l}/notes`, { content: 'QA RT 2294 note' }); out.note2 = n.s + ' ' + n.t.slice(0, 200); }
  await X.waitFor(45, async () => (await X.field('o', T.LEADS, l, 'description')) === 'QA RT note rule ran');
  out.afterNote = await X.field('o', T.LEADS, l, 'description') ?? '(empty)';
  out.exec = (await X.executions(l)).map(e => (e.triggerKind || '') + ' ' + e.outcome);
} finally { out.deactivate = (await api('o', 'POST', `/workflow/rules/${w.j.data.id}/deactivate`)).s; }
return out;
