const mid = await modId(); const g = (await getRule(mid, I.rF)).j.data; const r = await mkRec(mid, { first_name: P + ' rec F4', qa_lr_tier: 'Bronze', qa_lr_tags: ['C'] }, I.layout); LED('record F4 ' + r.id); I.F4 = r.id; SAVE();
return { rec: r.s + ' ' + r.id + ' ' + r.err, fo: JSON.stringify(g.branches.map(b => b.actions.filter(a => a.type === 'filter_options'))) };
