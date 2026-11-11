const us=arr((await api('GET','/iam/users?limit=200')).j.data); const u=us[0]; return {keys:Object.keys(u), sample:JSON.stringify(u).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,900)};
