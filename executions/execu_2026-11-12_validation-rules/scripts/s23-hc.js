const key = arr((await api('GET', '/help-centers')).j.data)[0].help_center_key; const fid = '639914b8-a2af-4d37-94dd-a55a9585b3f6'; I.hcKey = key; I.hcForm = fid; SAVE(); const out = {};
for (const p of ['/forms/' + fid, '/forms/' + fid + '/fields', '/forms/' + fid + '/schema']) { const x = await api('GET', '/help-center/public/' + key + p); out[p] = x.s + ' ' + x.t.slice(0, 1500); }
return out;
