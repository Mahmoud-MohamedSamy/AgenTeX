const mid = await modId(); const r = await api('GET', '/modules/' + mid + '/records/a6d49fe4-6d20-430e-830d-02059df1aaa9'); (I.recs = I.recs || []).push([mid, 'a6d49fe4-6d20-430e-830d-02059df1aaa9']); SAVE();
return (r.j.data.data || []).filter(d => /qa_vr_(text|pick)/.test(d.field));
