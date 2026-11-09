const o = arr((await api('GET', '/iam/org-units')).j?.data); const p = arr((await api('GET', '/iam/profiles')).j?.data);
const keep = o.filter(x => !/^(brand|dept):/.test(x.name));
const idk = Object.keys(o[0]).find(k => /id$/i.test(k) && !/parent|tenant/i.test(k)); const pk = Object.keys(p[0]).find(k => /id$/i.test(k) && !/parent|tenant/i.test(k));
return done({ ouKeys: Object.keys(o[0]), pKeys: Object.keys(p[0]), ous: keep.map(x => [x.name, x[idk], x.parentId ?? x.parent_id ?? x.parentOrgUnitId]), crmProf: p.filter(x => (x.appKey || x.app_key) === 'crm' || !(x.appKey || x.app_key)).map(x => [x.name, x[pk], x.rank, x.parentProfileId ?? x.parent_profile_id ?? x.parentId]) , deskAdmin: p.filter(x => x.name === 'Desk Administrator').map(x => x[pk]) });
