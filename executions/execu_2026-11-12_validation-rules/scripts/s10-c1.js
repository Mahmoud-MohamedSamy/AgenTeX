const mid = await modId(); const r = (await rules(mid)).find(x => x.name === P + ' C1 ui'); if (r) { (I.rules = I.rules || []).push([mid, r.id]); I.c1ui = r.id; SAVE(); }
return r && { id: r.id, desc: r.description, lay: r.layoutId === I.layout, pf: r.primaryField, mode: r.mode, status: r.status, branches: r.branches, ce: r.conditionError };
