return (await call('GET','/iam/profiles')).j.data.filter(p => /^QA W1 FP02/.test(p.name)).map(p => p.name + '|' + (p.profileId || p.id));
