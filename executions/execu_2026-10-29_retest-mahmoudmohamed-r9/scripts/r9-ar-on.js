const ar = arr((await api('o', 'GET', '/workflow/assignment-rules')).j?.data).find(x => /^QA RT 2321 AR/.test(x.name)); const cur = (await api('o', 'GET', '/workflow/assignment-rules/' + ar.id)).j?.data;
return { id: ar.id, name: ar.name, on: (await api('o', 'PATCH', '/workflow/assignment-rules/' + ar.id, { ...cur, isActive: true, allowedChannels: ['Import', 'WebForm', 'Api'] })).s };
