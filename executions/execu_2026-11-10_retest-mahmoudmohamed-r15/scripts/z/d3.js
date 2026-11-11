const l = await __z('GET','/api/v1/recycleBin?limit=100'); const qa = (l.j.data||[]).filter(x=>/^(#\d+ )?QA RT15 (2823|2794)/.test(x.displayName)); const others = (l.j.data||[]).filter(x=>!qa.includes(x)).map(x=>x.type+': '+x.displayName);
const first = qa[0]; const r = await __z('DELETE','/api/v1/recycleBin?ids='+first.id);
const after = await __z('GET','/api/v1/recycleBin?limit=100'); return { qa: qa.length, others, try: r.s+' '+r.t.slice(0,200), after: (after.j?.data||[]).length };
