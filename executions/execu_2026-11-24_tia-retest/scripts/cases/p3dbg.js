const o = {};
const profs = arr((await api('GET', '/iam/profiles?limit=200')).j?.data); o.profs = profs.filter(x => /manager|crm/i.test(x.name || '')).map(x => x.id + ' ' + x.name + ' ' + (x.app_key || x.appKey || ''));
const u = await api('GET', '/iam/users/3445ec4a-020e-4f12-b156-dd2de7610164?app_key=crm'); o.user = JSON.stringify(u.j?.data || u.t).replace(/"(email|phone)[^,]*,/g, '').slice(0, 500);
const vr = await api('POST', `/modules/${M.leads}/validation-rules`, { name: 'QA TIA P3 VR', condition: 'bad' }); o.vrMsg = vr.j?.error?.message;
const F = arr((await api('GET', `/modules/${M.leads}/fields`)).j?.data); o.optText = F.filter(f => f.datatypeKey === 'single_line' && !f.required && !f.isSystemField).map(f => f.apiName + ':' + (f.labels?.en || '')).slice(0, 12);
const locks = await api('GET', `/modules/${M.leads}/record-locks`); o.locks = (locks.t || '').slice(0, 600);
return o;
