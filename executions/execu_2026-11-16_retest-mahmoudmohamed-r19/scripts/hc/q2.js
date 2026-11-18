const f = await api('GET', `/modules/${TK}/fields?pageSize=300`); 
return f.j.data.filter(x=>/lookup|user/.test(x.datatypeKey)).map(x=>x.apiName+' '+x.datatypeKey+' '+JSON.stringify(x.datatypeOptions).slice(0,100));
