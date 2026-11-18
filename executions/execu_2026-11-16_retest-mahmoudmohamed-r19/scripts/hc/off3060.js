const id='ed0078d1-4081-45f1-ae11-5089e75e736f'; const g = await getBp(id);
const r = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: g.definition, isActive: false, revision: g.revision }); const g2 = await getBp(id);
LED('blueprint switched OFF '+id+' "QA BP RT19 HC 3060": '+E(r)+' active='+g2.isActive); return {r:E(r), active:g2.isActive};
