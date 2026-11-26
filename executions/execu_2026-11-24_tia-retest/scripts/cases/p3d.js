// Group D — knowledge base (D-01) and per-user daily limit (D-14). SUB=kb|limit
const SUB = process.env.SUB; const save = (k, v) => { const I2 = JSON.parse(fs.readFileSync(RUN + '/out/p3-ids.json', 'utf8')); I2[k] = v; fs.writeFileSync(RUN + '/out/p3-ids.json', JSON.stringify(I2, null, 1)); };
if (SUB === 'kb') {
  const cats = (await api('GET', '/desk/kb/categories')).j?.data?.categories || []; const cat = cats[0]?.id; const o = { cat: !!cat };
  const bodies = [{ title: 'QA TIA P3 KB refund window', body_html: '<p>The QA TIA P3 refund window is 47 days for all orders.</p>', status: 'published', category_id: cat, visibility: 'agents' }, { title: 'QA TIA P3 KB refund window', content: '<p>The QA TIA P3 refund window is 47 days for all orders.</p>', status: 'published', category_id: cat }, { title: 'QA TIA P3 KB refund window', body: 'The QA TIA P3 refund window is 47 days for all orders.', status: 'published', category_id: cat }];
  let id = null; for (const b of bodies) { const r = await api('POST', '/desk/kb/articles', b); o.create = r.s + ' ' + (r.t || '').slice(0, 160); if (r.s < 300) { id = r.j?.data?.id; break; } }
  if (id) { ledger('P3 D-01: KB article QA TIA P3 KB ' + id + ' — delete in R'); save('kbArticle', id); const g = (await api('GET', `/desk/kb/articles/${id}`)).j?.data; o.status = g?.status; o.vis = g?.visibility; if (g?.status !== 'published') { const p = await api('POST', `/desk/kb/articles/${id}/publish`, {}); o.publish = p.s; } }
  await sleep(15000);
  for (const app of ['desk', 'crm']) { const r = await ask('According to our knowledge base, what is the QA TIA P3 refund window?', { page: { app } }); o[app] = { text: tiaText(r).slice(0, 300), citations: JSON.stringify(r.final?.citations || null).slice(0, 300), refs: (r.final?.refs || []).map(x => x.label).slice(0, 3) }; }
  p3rec('D-01', '?', JSON.stringify(o).slice(0, 1200)); return o;
}
if (SUB === 'limit') {
  const o = {}; const a = await getAgent(); const def = JSON.parse(JSON.stringify(a.draft_definition)); def.tia = { ...def.tia, daily_user_credit_limit: 1 };
  const put = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const dep = await api('POST', `/agents/${a.id}/deploy`, {}); ledger(`P3 D-14: per-user daily credit limit set to 1 and deployed (${put.s}/${dep.s}) — restore`);
  o.set = put.s + '/' + dep.s; await sleep(5000);
  const r = await ask('hi', { page: { app: 'desk' } }); o.turn = { err: r.error || null, text: tiaText(r).slice(0, 300) }; const st = await api('GET', '/agents/tia/status?app=desk'); o.status = JSON.stringify(st.j?.data).slice(0, 200);
  // restore from baseline
  const B = JSON.parse(fs.readFileSync(RUN + '/out/p3-baseline.json', 'utf8')); const a2 = await getAgent(); const put2 = await api('PUT', `/agents/${a2.id}/draft`, { name: a2.name, description: a2.description, definition: B.agent.def, expected_updated_at: a2.updated_at }); const dep2 = await api('POST', `/agents/${a2.id}/deploy`, {});
  const a3 = await getAgent(); o.restored = put2.s + '/' + dep2.s + ' same=' + (JSON.stringify(a3.draft_definition) === JSON.stringify(B.agent.def)) + ' ver=' + a3.deployed_version_no; ledger('P3 D-14: Tia definition restored ' + o.restored);
  const r2 = await ask('hi', { page: { app: 'desk' } }); o.after = { err: r2.error || null, text: tiaText(r2).slice(0, 120) };
  p3rec('D-14', '?', JSON.stringify(o).slice(0, 1200)); return o;
}
