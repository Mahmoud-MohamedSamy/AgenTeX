const DA = '44444444-4444-4444-4444-444444444402'; const pr = await api('GET', '/iam/profiles/' + DA); const pj = D(pr.j) || {};
out.keys = Object.keys(pj).join(','); const s = JSON.stringify(pj); out.len = s.length;
out.prod = (s.match(/.{0,120}product.{0,160}/gi) || []).slice(0, 8);
out.modPerm = (s.match(/.{0,60}"(module_permissions|modulePermissions|objects|object_permissions)".{0,300}/i) || [''])[0];
// W5-72 timings
const tm = async u => { const r = []; for (let i = 0; i < 3; i++) { const t0 = Date.now(); await page.goto(H + u, { waitUntil: 'domcontentloaded' }); for (let k = 0; k < 80; k++) { await sleep(250); const t = await mtxt(); if (t.length > 300 && !/Loading/.test(t.slice(0, 300))) break; } r.push(+((Date.now() - t0) / 1000).toFixed(1)); } return r; };
out.t_contacts = await tm('/modules/' + CM); out.t_contact = await tm('/modules/' + CM + '/customers/' + C1); out.t_overview = await tm('/analytics/dashboards/standard/overview'); out.t_activities = await tm('/activities');
return fin({ out });
