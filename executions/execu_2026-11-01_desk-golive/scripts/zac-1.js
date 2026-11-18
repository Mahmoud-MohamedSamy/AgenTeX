const g = async p => { const r = await api(page, 'GET', p); return r.j || r.t; };
out.profiles = ((await g('profiles')).data || []).map(p => p.name + '|' + p.id + '|' + p.type);
out.roles = ((await g('roles')).data || []).map(p => p.name + '|' + p.id + '|' + p.reportsTo + '|peers:' + p.shareDataWithPeers);
out.ds = JSON.stringify(await g('dataSharingRules')).slice(0, 800);
out.ag2 = JSON.stringify(await g('agents/1499272000000432034')).slice(0, 900);
out.ag1 = JSON.stringify(await g('agents?limit=20')).match(/"name":"[^"]+"|"id":"\d+"|"roleId":"\d+"|"profileId":"\d+"|"associatedDepartmentIds":\[[^\]]*\]|"emailId":"[^"]+"/g)?.join(' ').replace(/([a-z0-9._-]{3})[a-z0-9._-]*@/gi, '$1…@');
const pid = (out.ag2.match(/"profileId":"(\d+)"/) || [])[1]; out.ag2perm = pid ? JSON.stringify(await g('profiles/' + pid)).slice(0, 2500) : '';
