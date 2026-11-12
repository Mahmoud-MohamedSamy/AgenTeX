const ids = ['1475109000000529480','1475109000000570263','1475109000000570221','1475109000000529517','1475109000000529696','1475109000000529735','1475109000000529774','1475109000000529873','1475109000000529915','1475109000000529959','1475109000000570017','1475109000000570058','1475109000000570097','1475109000000570183'];
const o = {};
let r = await z('DELETE', '/recycleBin?ids=' + ids.join(',')); o.a = [r.s, r.t.slice(0,200)];
if (r.s >= 300) { r = await z('POST', '/recycleBin/delete', { ids }); o.b = [r.s, r.t.slice(0,200)]; }
const rb = await z('GET', '/recycleBin?limit=50'); o.left = (rb.j?.data||[]).filter(x => ids.includes(x.id)).length; o.others = (rb.j?.data||[]).filter(x => !ids.includes(x.id)).map(x=>x.displayName);
return o;
