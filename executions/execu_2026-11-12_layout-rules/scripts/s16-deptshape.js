const d = arr((await api('GET', '/desk/departments')).j.data); const qa = d.find(x => x.name === 'QA AO Dept A');
const g = await api('GET', '/desk/departments/' + qa.id);
const F = (await fieldsOf(await modId())).filter(f => f.fieldName === 'qa_lr_type' || f.fieldName === 'subject');
return { keys: Object.keys(g.j?.data || {}), dept: JSON.stringify(g.j?.data || g.t).replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 1500), fieldCfg: F.map(f => f.fieldName + ' ' + JSON.stringify(f.config).slice(0, 400)) };
