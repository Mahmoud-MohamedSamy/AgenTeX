const all = arr((await api('o', 'GET', '/iam/permissions?limit=1000')).j?.data).map(x => x.permissionKey);
return { profileKeys: all.filter(k => /iam[.:]profile/.test(k)), n: all.length };
