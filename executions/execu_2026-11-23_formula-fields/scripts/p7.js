const M = made.mod, LID = made.layouts[0];
for (const n of [1, 5, 50]) { const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX I2 sort ' + n, qa_num: n }) }); if (r.j?.data?.id) { made.recs.push(r.j.data.id); keep(); } log(n, E(r), flat(r.j?.data?.data).qa_fx_ui_double); }
