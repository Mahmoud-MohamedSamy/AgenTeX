const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', A = 'b8941829-5e08-43e1-b8e0-89c33bb9903c'; const o = {}; const re = /QA RT1[12]/;
const bp = arr((await api('o', 'GET', `desk:/modules/${TK}/blueprints`)).j?.data); o.bpAll = bp.map(b => (b.definition?.name || b.name) + '|' + b.id.slice(0, 8) + '|' + b.isActive);
const ids = ['0598d5d1-c843-4154-8487-4f5ea5f3f15f','45e045b1-2991-46dc-9af0-5b158de25ea8','b1d51be9-6ef1-4c31-9a7e-d5293af29985','26fe5891-2d81-4743-8802-9cb63d133a36','ec6ba2aa-1dce-42f6-ac2d-d7dad3521d91','43f634ff-950b-4513-8ae0-318eaf4f97da','af4dff23-7fb7-403b-89aa-a8fe97a2d801','caeb6f1a-076a-4523-aecf-553bc0edfd36','7d2c276d-e3e1-418d-b5ca-709644f0e5e0'];
o.bpById = []; for (const id of ids) { const r = await api('o', 'GET', `desk:/modules/${TK}/blueprints/${id}`); o.bpById.push(id.slice(0, 8) + ' ' + r.s + ' ' + (r.j?.data?.definition?.name || '') + ' ' + r.j?.data?.isActive); }
const wf = []; for (let p = 1; p <= 10; p++) { const r = await api('o', 'GET', `desk:/workflow/rules?per_page=50&page=${p}`); const L = arr(r.j?.data); wf.push(...L); if (L.length < 50) break; if (p > 1 && L[0]?.id === wf[0].id) { o.wfNoPaging = true; break; } }
o.wfN = wf.length; o.wfQA = wf.filter(x => re.test(x.name)).map(x => x.name + '|' + x.id);
for (const id of ['62f78152-7033-4af8-b75f-551c219f85f6','2bb8296b-e17c-4ac0-a48d-2f87d5b786c5','ae19f6b9-0ac9-4f60-bd2f-765585ade51b','eab1fa40-ece3-46dc-9d98-5f50e7ff0465']) { const r = await api('o', 'GET', `desk:/workflow/rules/${id}`); o['wf_' + id.slice(0, 8)] = r.s + ' ' + (r.j?.data?.name || ''); }
const sk = (await api('o', 'GET', `desk:/desk/skills?department_id=${A}`)).j?.data; o.skills = arr(sk?.skills).map(s => s.name + '|' + s.id.slice(0, 8)); o.types = arr(sk?.types).map(s => s.name + '|' + s.id.slice(0, 8)); o.skPrefs = sk?.preferences;
o.rr = (await api('o', 'GET', `desk:/desk/departments/${A}/round-robin-preferences`)).j?.data;
const d = (await api('o', 'GET', `desk:/desk/departments/${A}`)); o.deptA = { s: d.s, keys: d.j?.data && Object.keys(d.j.data), agents: JSON.stringify(d.j?.data?.agent_ids || d.j?.data?.agents || '').slice(0, 300) };
o.ticketStatusHasVerify = JSON.stringify((await api('o', 'GET', `desk:/modules/${TK}/fields`)).j).includes('QA RT11 Verify');
return o;
