const mid = await modId(); const lid = I.layout; const out = {};
const rec = (await api('GET','/modules/'+mid+'/records/'+I.G2)).j.data; out.recKeys = JSON.stringify(rec).slice(0,600);
return out;
