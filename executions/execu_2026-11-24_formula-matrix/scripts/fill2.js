const M = made.mod, F = made.files; const res = {};
const fo = (id, n, sz, mime) => ({ file_id: id, filename: n, size_bytes: sz, mime, url: id });
const plans = L((await api('GET', '/desk/sla/support-plans?limit=50')).j?.data); res.plans = plans.map(p => ({ id: p.id, name: p.name, dep: p.department_id || p.departmentId || p.department?.id }));
const DEP = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const plan = plans.find(p => (p.department_id || p.departmentId || p.department?.id) === DEP);
const vals = { in_file_upload: fo(F.doc.id, 'qa-fx-matrix.txt', 22, 'text/plain'), in_image_upload: fo(F.img.id, 'qa-fx-matrix.png', 68, 'image/png'), in_camera: [{ ...fo(F.cam.id, 'qa-fx-camera.png', 68, 'image/png'), captured_at: new Date().toISOString() }] };
if (plan) vals.in_support_plan = plan.id;
for (const [k, v] of Object.entries(vals)) res[k] = E(await api('PATCH', `/modules/${M}/records/${made.recFull}`, { data: data({ [k]: v }) })).slice(0, 250);
const back = await getRec(M, made.recFull); res.back = Object.fromEntries(Object.keys(vals).map(k => [k, back[k]]));
fs.writeFileSync(RUN + '/out/fill2.json', JSON.stringify(res, null, 1)); log(res);
