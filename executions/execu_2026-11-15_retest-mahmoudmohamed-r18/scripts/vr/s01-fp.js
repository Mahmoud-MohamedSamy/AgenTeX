const mid = await modId(); const fp = arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data);
const o = { sample: fp[0], qa: fp.filter(x => /qa_rt18/.test(x.fieldName || '')), profiles: [...new Set(fp.map(x => x.profileId + ' ' + (x.profileName || '')))] };
const pr = await api('GET', '/iam/profiles'); o.pr = pr.s + ' ' + JSON.stringify(arr(pr.j && pr.j.data).map(p => [p.name, p.id])).slice(0, 800);
return o;
