const p = await api('GET', '/iam/profiles?app_key=desk'); const ps = arr(p.j?.data?.profiles || p.j?.data?.items || p.j?.data);
return { keys: Object.keys(ps[0]), rows: ps.map(x => x.name + ' | ' + (x.profileId || x.profile_id || x.uuid) + ' | ' + JSON.stringify(x).match(/[a-z_.:]*approv[a-z_.:]*/gi)) };
