const mid = await modId(); return (await rules(mid)).map(x => x.name + ' | depts ' + JSON.stringify(x.departmentIds)); 
