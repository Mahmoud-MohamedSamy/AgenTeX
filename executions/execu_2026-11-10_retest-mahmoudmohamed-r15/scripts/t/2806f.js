const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const f = { fieldName:'qa_rt15_gs_a', labels:{en:'QA RT15 GS A'}, datatypeKey:'pick_list', config:{allowed_values:['Red','Green','Yellow']} };
for (const b of [{fields:[f]}, [f], f]) { const r = await api('POST','/modules/'+L+'/fields', b); log(Array.isArray(b)?'arr':Object.keys(b)[0], r.s, r.t.slice(0,700)); if (r.s<300) break; }
