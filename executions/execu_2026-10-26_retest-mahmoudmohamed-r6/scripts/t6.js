const p = arr((await api('GET', '/iam/profiles')).j?.data); const k = Object.keys(p[0] || {});
const pick = n => p.filter(x => x.name === n && /crm/.test(x.app_key || x.appKey || 'crm')).map(x => x.profile_id || x.id || x.profileId);
const u = arr((await api('GET', '/iam/users?app_key=crm&limit=100')).j?.data).find(x => x.email === 'valafo4080@94an.com');
return done({ keys: k.join(','), crmAdmin: pick('CRM Admin'), manager: pick('Manager'), test: pick('test'), user: { profiles: u?.profileNames, ou: u?.orgUnitId } });
