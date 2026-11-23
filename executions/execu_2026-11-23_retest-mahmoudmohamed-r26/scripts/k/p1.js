const ag = await api('GET', '/desk/agents?limit=100'); log('agents', ag.s, arr(ag.j).map(x => (x.display_name||x.name||x.full_name) + ' ' + (x.user_id||x.id).slice(0,8)).join(' | ').slice(0,1500));
const g = (await api('GET', '/desk/departments/93949fbd-'.slice(0,0) + '/desk/departments?limit=1')); 
const one = (await api('GET', '/desk/departments/' + arr((await api('GET','/desk/departments?limit=100')).j).find(x=>x.name==='QA AO Dept B').id)).j?.data; log('sample keys', Object.keys(one||{}).join(','));
