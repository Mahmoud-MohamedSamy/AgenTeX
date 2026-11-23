const M = made.mod, LID = made.layouts[0];
const lay = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data; fs.writeFileSync(RUN + '/out/layout-before-k3.json', JSON.stringify(lay));
const views = JSON.parse(JSON.stringify(lay.views));
for (const v of Object.keys(views)) for (const s of views[v].layout.sections) for (const c of s.columns) c.fields = c.fields.filter(f => f.fieldName !== 'qa_num');
const body = { name: lay.name, views, assignedProfiles: lay.assignedProfiles, status: lay.status, accessMode: lay.accessMode, rowVersion: lay.rowVersion, description: lay.description };
const r = await api('PUT', `/modules/${M}/layouts/${LID}`, body); log('remove qa_num from layout', E(r));
const rec = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX K3', qa_num: 4 }) }); if (rec.j?.data?.id) { made.recs.push(rec.j.data.id); keep(); }
const v = flat(rec.j?.data?.data); log('record with qa_num 4 after removal', E(rec), 'qa_num', v.qa_num, 'ui double', v.qa_fx_ui_double, 'fx_e7', v.fx_e7);
const old = made.recs.find(Boolean); const h1 = 'd2330d02-ba1d-4b98-8ab8-4341baee4feb'; const p = await api('PATCH', `/modules/${M}/records/${h1}`, { data: data({ qa_text: 'k3 touch' }) }); const hv = await getRec(M, h1); log('H1 record (qa_num 7) after unrelated edit', E(p), 'qa_num', hv.qa_num, 'ui double', hv.qa_fx_ui_double);
// restore
const now = (await api('GET', `/modules/${M}/layouts/${LID}`)).j.data;
const rr = await api('PUT', `/modules/${M}/layouts/${LID}`, { ...body, views: lay.views, rowVersion: now.rowVersion }); log('restore layout', E(rr));
