const G = []; const onG = async r => { const u = r.url(); if (/data-?types|datatypes/i.test(u) && r.request().method() === 'GET') { let t = ''; try { t = await r.text(); } catch (e) {} G.push(u.replace(API, '') + ' ' + t.slice(0, 3000)); } }; page.on('response', onG);
await go('/settings/data-types', 10000); page.off('response', onG);
out.G = G.map(x => x.slice(0, 200)); const big = G.find(x => /"key"/.test(x)) || ''; out.keys = (big.match(/"key":"[a-z_]+"/g) || []).map(s => s.slice(7, -1));
return fin({ out });
