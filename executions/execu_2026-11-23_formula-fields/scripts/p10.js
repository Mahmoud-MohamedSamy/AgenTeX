const M = made.mod; const recs = L((await api('GET', `/modules/${M}/records?limit=10&sort_by=created_at&sort_dir=desc`)).j?.data).map(x => flat(x.data)).filter(v => /H8 wf/.test(v.name));
for (const v of recs) log(v.name, 'qa_num', v.qa_num, 'fx_e7 (qa_num*2)', v.fx_e7, 'fx_b2 (qa_num*1.5)', v.fx_b2, 'ui', v.qa_fx_ui_double, 'modified', v.modified_at);
