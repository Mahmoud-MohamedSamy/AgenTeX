const o = {};
const r = await z('POST', '/skills/order', { departmentId: DEPT, skillIds: ['1475109000000529026'] }); o.order = [r.s, r.t.slice(0,150)];
const l = await z('GET', `/skills?departmentId=${DEPT}&limit=10`); o.test = (l.j?.data||[]).map(s => [s.name, s.orderId]);
const rb = await z('GET', '/recycleBin?limit=50'); o.rb = [rb.s, (rb.j?.data||[]).map(x => [x.id, x.module || x.moduleName, (x.name || x.displayName || x.subject || '').slice(0,40)]), rb.t.slice(0,200)];
return o;
