const mid = await modId(); const out = {};
const tr = (await getRule(mid, I.r2)).j.data; tr.branches = I.r2orig; out.tier = SR(await putRule(mid, I.r2, tr));
const ca = (await getRule(mid, I.rF)).j.data; ca.branches = I.rForig; out.ca = SR(await putRule(mid, I.rF, ca));
out.vr = SR(await api('GET','/modules/'+mid+'/validation-rules')).slice(0,100); const v = (await api('GET','/modules/'+mid+'/validation-rules')).j; out.vrSample = JSON.stringify(v && v.data && v.data[0] || v).slice(0,900);
return out;
