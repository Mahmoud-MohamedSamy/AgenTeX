const mid = I.mod_leads; const rs = await rules(mid);
return rs.filter(r => r.layoutId === I.layout || /QA RT18/.test(r.name)).map(r => [r.name, r.id.slice(0,8), r.status, r.layoutId && r.layoutId.slice(0,8), r.primaryField, r.errorPlacement, JSON.stringify(r.branches && r.branches.map(b => b.check)).slice(0, 160)]);
