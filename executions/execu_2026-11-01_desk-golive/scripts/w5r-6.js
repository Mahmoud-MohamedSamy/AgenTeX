const pl = arr(D((await api('GET', '/iam/profiles?app_key=desk')).j)); const da = pl.find(p => p.name === 'Desk Agent') || {}; out.daKeys = Object.keys(da).join(','); const pid = da.id || da.profileId || da.profile_id || '44444444-4444-4444-4444-444444444402'; out.pid = pid;
for (const p of ['/permissions', '/effective']) { const r = await api('GET', '/iam/profiles/' + pid + p + '?app_key=desk'); const s = JSON.stringify(D(r.j)); out[p] = r.s + ' len ' + s.length; out[p + ' product'] = (s.match(/.{0,100}product.{0,140}/gi) || []).slice(0, 10); }
const mine = await api('GET', '/iam/me/permissions'); out.ownerProd = (JSON.stringify(D(mine.j)).match(/"[^"]*product[^"]*"/gi) || []).slice(0, 10);
return fin({ out });
