const out = {};
for (const p of ['/iam/profiles?app_key=desk&include=permissions', '/iam/profiles/44444444-4444-4444-4444-444444444402/permissions?app_key=desk', '/iam/permissions?app_key=desk', '/iam/me/permissions?app_key=desk']) {
  const r = await api('GET', p); const s = JSON.stringify(r.j?.data || '');
  out[p] = r.s + ' len' + s.length + ' bp:' + [...new Set(s.match(/desk:[a-z_.:]*blueprint[a-z_.:]*/g) || [])].join(' ');
}
const ra = await A('GET', '/iam/me/permissions?app_key=desk'); out.agentMe = ra.s + ' ' + [...new Set(JSON.stringify(ra.j?.data || '').match(/desk:[a-z_.:]*blueprint[a-z_.:]*/g) || [])].join(' ');
const rb = await B('GET', '/iam/me/permissions?app_key=desk'); out.adminMe = rb.s + ' ' + [...new Set(JSON.stringify(rb.j?.data || '').match(/desk:[a-z_.:]*blueprint[a-z_.:]*/g) || [])].join(' ');
const rc = await C('GET', '/iam/me/permissions?app_key=desk'); out.superMe = rc.s + ' ' + [...new Set(JSON.stringify(rc.j?.data || '').match(/desk:[a-z_.:]*blueprint[a-z_.:]*/g) || [])].join(' ');
return out;
