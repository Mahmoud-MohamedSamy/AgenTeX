const mid = await modId(); const g = (await getRule(mid, I.r4)).j.data; const on = process.env.LEN === 'on';
const cur = g.branches.filter(b => !(b.actions[0].type === 'show_sections')); if (on) cur.splice(6, 0, I.r4lenBr || g.branches.find(b => b.actions[0].type === 'show_sections'));
if (!I.r4lenBr) { I.r4lenBr = g.branches.find(b => b.actions[0].type === 'show_sections'); SAVE(); }
g.branches = cur; return { put: SR(await putRule(mid, I.r4, g)), n: cur.length };
