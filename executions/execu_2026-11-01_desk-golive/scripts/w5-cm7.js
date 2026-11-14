const MID = '01f7df91-4300-495f-ae3e-5de49189195a';
await sleep(20000);
const l = await api('GET', '/modules/' + MID + '/records?page=1&per_page=5'); out.list = l.s + ' ' + JSON.stringify(l.j && l.j.meta).slice(0, 160) + ' n=' + arr(D(l.j)).length;
const d = await api('DELETE', '/modules/' + MID); out.del = d.s + ' ' + d.t.slice(0, 200);
return fin({ out });
