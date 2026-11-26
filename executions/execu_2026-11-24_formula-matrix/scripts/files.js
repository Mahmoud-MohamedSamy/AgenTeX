// Upload small files the way the app does (POST /files -> PUT presigned -> confirm), find a team, then fill the remaining inputs.
const M = made.mod, OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7'; const res = {};
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const up = async (name, type, bytes, purpose) => {
  const c = await api('POST', '/files', { app_key: 'crm', purpose, ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, owner_user_id: OWNER, declared_size_bytes: bytes.length });
  if (c.s >= 300) return { err: 'create ' + E(c).slice(0, 200) };
  let url = c.j.data.upload_url; let p = await fetch(url, { method: 'PUT', headers: { 'content-type': type }, body: bytes }).catch(e => ({ status: 'ERR ' + e.message }));
  if (!(p.status < 300)) { const u = new URL(url); const u2 = 'https://staging-crm.taviportal.com' + u.pathname + u.search; p = await fetch(u2, { method: 'PUT', headers: { 'content-type': type }, body: bytes }).catch(e => ({ status: 'ERR ' + e.message })); }
  const cf = await api('POST', `/files/${c.j.data.file_id}/confirm`, { file_id: c.j.data.file_id, size_bytes: bytes.length });
  return { id: c.j.data.file_id, put: p.status, confirm: E(cf).slice(0, 150) }; };
if (!made.files) { made.files = { doc: await up('qa-fx-matrix.txt', 'text/plain', Buffer.from('QA FX Matrix test file'), 'document'), img: await up('qa-fx-matrix.png', 'image/png', png, 'photo'), cam: await up('qa-fx-camera.png', 'image/png', png, 'photo') }; keep(); led('CRM files uploaded ' + JSON.stringify(made.files)); }
res.files = made.files;
const t = await api('GET', '/desk/teams?limit=5', undefined, { app: 'desk' }); res.teamProbe = E(t) + ' n=' + L(t.j?.data).length; const team = L(t.j?.data)[0]; res.team = team && { id: team.id, name: team.name };
const plan = L((await api('GET', '/desk/sla/support-plans?limit=5')).j?.data)[0]; res.plan = plan && { id: plan.id, name: plan.name };
// try value shapes on the filled record
const tryShapes = async (field, shapes) => { for (const [lab, v] of shapes) { const r = await api('PATCH', `/modules/${M}/records/${made.recFull}`, { data: data({ [field]: v }) });
  const back = (await getRec(M, made.recFull))[field]; if (r.s < 300 && back != null && !(Array.isArray(back) && !back.length)) return { ok: lab, back }; res['try ' + field + ' ' + lab] = E(r).slice(0, 200); } return { ok: null }; };
const F = made.files || {};
if (F.doc?.id) res.in_file_upload = await tryShapes('in_file_upload', [['id', F.doc.id], ['[id]', [F.doc.id]], ['[{file_id}]', [{ file_id: F.doc.id, name: 'qa-fx-matrix.txt' }]], ['{file_id}', { file_id: F.doc.id, name: 'qa-fx-matrix.txt' }]]);
if (F.img?.id) res.in_image_upload = await tryShapes('in_image_upload', [['id', F.img.id], ['[id]', [F.img.id]], ['[{file_id}]', [{ file_id: F.img.id, name: 'qa-fx-matrix.png' }]], ['{file_id}', { file_id: F.img.id }]]);
if (F.cam?.id) res.in_camera = await tryShapes('in_camera', [['id', F.cam.id], ['[id]', [F.cam.id]], ['[{file_id}]', [{ file_id: F.cam.id, name: 'qa-fx-camera.png' }]], ['{file_id}', { file_id: F.cam.id }]]);
if (team) res.in_team = await tryShapes('in_team', [['id', team.id], ['[id]', [team.id]]]);
if (plan) res.in_support_plan = await tryShapes('in_support_plan', [['id', plan.id]]);
fs.writeFileSync(RUN + '/out/files.json', JSON.stringify(res, null, 1)); log(res);
