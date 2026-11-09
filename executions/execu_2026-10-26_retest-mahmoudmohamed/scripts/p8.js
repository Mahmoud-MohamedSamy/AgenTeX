const a = arr((await api('GET', '/workflow/actions')).j?.data); const ca = await api('GET', '/workflow/custom-actions');
return fin({ sample: JSON.stringify(a[0]).replace(/,"[a-zA-Z]+":null/g, '').slice(0, 700), types: [...new Set(a.map(x => x.type || x.action?.type))], custom: ca.t.slice(0, 500) });
