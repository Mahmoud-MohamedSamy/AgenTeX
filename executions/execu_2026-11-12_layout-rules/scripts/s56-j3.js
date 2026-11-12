const mid = await modId(); const lid = I.layout; const out = {}; const mode = process.env.M;
const strip = b => { delete b.id; for (const k of ['displayInHelpCenter','helpCenterDisplayName','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents']) delete b[k]; return b; };
if (mode === 'setup') { const v = (await getRule(mid, I.r3)).j.data; I.r3orig = I.r3orig || v.branches; SAVE(); v.branches = [br(eq('qa_lr_vip', true), [show(['qa_lr_date']), req(['qa_lr_note'])])]; out.vip = SR(await putRule(mid, I.r3, v));
  const cur = await getLayout(mid, lid); fs.writeFileSync(RUN + '/out/layout-pre-j.json', JSON.stringify(cur)); for (const vw of Object.values(cur.views)) for (const s of vw.layout.sections) for (const c of s.columns) c.fields = c.fields.filter(f => f.fieldName !== 'qa_lr_date');
  out.lay = SR(await api('PUT', '/modules/' + mid + '/layouts/' + lid, strip({ ...cur }))).slice(0, 300); }
if (mode === 'j6') { const cur = await getLayout(mid, lid); for (const vw of Object.values(cur.views)) vw.layout.sections = vw.layout.sections.filter(s => s.id !== 'sec-qa-lr-b'); out.lay = SR(await api('PUT', '/modules/' + mid + '/layouts/' + lid, strip({ ...cur }))).slice(0, 300); }
if (mode === 'restore') { const keep = JSON.parse(fs.readFileSync(RUN + '/out/layout-pre-j.json', 'utf8')); const cur = await getLayout(mid, lid); for (const [k, v] of Object.entries(cur.views)) if (keep.views[k]) v.layout = keep.views[k].layout; out.lay = SR(await api('PUT', '/modules/' + mid + '/layouts/' + lid, strip({ ...cur }))).slice(0, 300); }
out.rules = (await rules(mid, '?layoutId=' + lid)).map(r => r.name + ' ' + r.status + ' err=' + (r.definitionError ? JSON.stringify(r.definitionError).slice(0, 160) : 'n'));
return out;
