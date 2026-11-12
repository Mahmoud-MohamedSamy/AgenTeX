const mid = await modId(); const lid = I.layout; const out = {};
const g = (await getRule(mid, I.r4)).j.data; const N = c => ({ op:'and', children:[ eq('qa_lr_radio','No'), c ] });
I.r4orig = I.r4orig || g.branches; SAVE();
g.branches = [ I.r4orig[0],
 br(N({op:'contains',field:'qa_lr_text',value:'abc'}), [req(['qa_lr_tags'])]),
 br(N({op:'startsWith',field:'qa_lr_text',value:'QA'}), [req(['qa_lr_note'])]),
 br(N({op:'endsWith',field:'qa_lr_text',value:'xyz'}), [req(['qa_lr_amount'])]),
 br(N({op:'isNull',field:'qa_lr_email2'}), [show(['qa_lr_reason'])]),
 br(N({op:'regexMatches',field:'qa_lr_text',value:'^[0-9]{3}$'}), [show(['qa_lr_order'])]),
 br(N({op:'lengthGt',field:'qa_lr_text',value:20}), [secs(['sec-qa-lr-b'])]),
 br(N({op:'gte',field:'qa_lr_amount',value:100}), [req(['qa_lr_email2'])]),
 br(N({op:'gt',field:'qa_lr_date',value:'2026-01-01'}), [req(['qa_lr_text'])]),
 br({op:'or',children:[ N(eq('qa_lr_text','or1')), N(eq('qa_lr_amount',7)) ]}, [req(['phone'])]) ];
out.put = SR(await putRule(mid, I.r4, g)).slice(0,300);
const me = (await api('GET','/me')).j; out.me = JSON.stringify(me).slice(0,200);
return out;
