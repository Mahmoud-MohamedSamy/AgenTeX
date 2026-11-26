// Find values for team / support plan / file inputs, then build test records on layout 1 and layout 2.
const M = made.mod; const res = { probes: {} };
const tryGet = async (ps) => { for (const p of ps) { const r = await api('GET', p); res.probes[p] = r.s + ' n=' + L(r.j?.data).length; const l = L(r.j?.data); if (r.s < 300 && l.length) return { p, id: l[0].id, name: l[0].name || l[0].labels?.en || l[0].title || l[0].display_name || '' }; } return null; };
const fl = L((await api('GET', `/modules/${M}/fields`)).j?.data); const fd = n => fl.find(f => f.fieldName === n);
res.opts = Object.fromEntries(['in_team', 'in_support_plan', 'in_file_upload', 'in_camera', 'in_image_upload', 'in_department', 'in_email_template'].map(n => [n, fd(n)?.datatypeOptions || null]));
const team = await tryGet(['/iam/teams?limit=5', '/teams?limit=5', '/desk/teams?limit=5', '/crm/teams?limit=5', '/iam/user-groups?limit=5', '/iam/groups?limit=5']);
const plan = await tryGet(['/desk/support-plans?limit=5', '/support-plans?limit=5', '/desk/contracts/support-plans?limit=5', '/desk/sla/support-plans?limit=5', '/desk/plans?limit=5']);
res.team = team; res.plan = plan;
// file upload: try the files service
let file = null; for (const p of ['/files', '/files/upload', '/files/uploads', `/modules/${M}/files`, '/attachments']) {
  const fdm = new FormData(); fdm.append('file', new Blob(['QA FX Matrix test file'], { type: 'text/plain' }), 'qa-fx-matrix.txt');
  const r = await api('POST', p, fdm, { form: true }); res.probes['POST ' + p] = E(r).slice(0, 160); if (r.s < 300 && (r.j?.data?.id || r.j?.data?.file_id)) { file = { p, ...r.j.data }; break; } }
res.file = file && { p: file.p, id: file.id || file.file_id, keys: Object.keys(file) };
fs.writeFileSync(RUN + '/out/prep.json', JSON.stringify(res, null, 1)); log(res);
