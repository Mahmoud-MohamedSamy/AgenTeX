const TK = '88e8ea44-1658-4df3-9930-d0902b91073d'; const o = {};
const sh = r => ({ s: r.s, keys: r.j && Object.keys(r.j), dkeys: r.j?.data && !Array.isArray(r.j.data) ? Object.keys(r.j.data) : (Array.isArray(r.j?.data) ? 'arr' + r.j.data.length : null), meta: r.j?.meta, first: JSON.stringify((arr(r.j?.data?.items || r.j?.data?.blueprints || r.j?.data) || [])[0] || '').slice(0, 300) });
o.wf = sh(await api('o', 'GET', 'desk:/workflow/rules?per_page=200'));
o.bp = sh(await api('o', 'GET', `desk:/modules/${TK}/blueprints`));
o.sk = sh(await api('o', 'GET', `desk:/desk/skills?department_id=b8941829-5e08-43e1-b8e0-89c33bb9903c`));
o.st = sh(await api('o', 'GET', `desk:/desk/skill-types?department_id=b8941829-5e08-43e1-b8e0-89c33bb9903c`));
return o;
