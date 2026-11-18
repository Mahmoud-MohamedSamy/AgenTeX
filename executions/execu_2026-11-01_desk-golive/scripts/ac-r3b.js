const id = 'b0acbfc3-582b-424d-9c9e-8a4ff8b280c6'; out.t = [];
for (const p of ['/sla/reapply', '/sla/re-apply', '/reapply-sla', '/sla/apply']) { const r = await api('POST', '/desk/tickets/' + id + p, {}); out.t.push(p + ' ' + r.s + ' ' + r.t.slice(0, 160)); if (r.s < 300) break; }
await sleep(5000); out.s = (await api('GET', '/desk/tickets/' + id + '/sla')).t.slice(0, 500);
return fin({ out });
