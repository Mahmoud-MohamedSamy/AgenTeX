const r = await call('GET', '/settings/hub');
const items = []; const walk = (o, d) => { if (Array.isArray(o)) return o.forEach(x => walk(x, d)); if (o && typeof o === 'object') { if (o.route || o.path || o.href) items.push([o.key || o.id, (o.label || o.title || o.name || ''), o.route || o.path || o.href, o.app_key || o.target_app || '', o.status || ''].join(' | ')); for (const v of Object.values(o)) walk(v, d + 1); } };
walk(r.j, 0);
return { s: r.s, n: items.length, items: items.filter(x => !/desk/i.test(x.split(' | ')[3])) };
