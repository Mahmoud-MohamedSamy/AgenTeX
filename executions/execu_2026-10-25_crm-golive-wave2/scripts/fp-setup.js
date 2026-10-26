const out = {};
const p = await call('POST', '/iam/profiles', { name: 'QA W2 Import FP', parent_profile_id: '11111111-1111-1111-1111-111111111102', rank: 100, is_tenant_wide: false, source_profile_id: '11111111-1111-1111-1111-111111111103', app_key: 'crm' });
out.profile = p.s; const pid = p.j && p.j.data && (p.j.data.profileId || p.j.data.id || p.j.data.profile_id); out.pid = pid;
if (!pid) { const all = await call('GET', '/iam/profiles'); const f = (all.j.data || []).find(x => x.name === 'QA W2 Import FP'); out.pid = f && f.profileId; }
const fp1 = await call('POST', `/modules/${MODS.leads}/field-permissions`, { fieldId: '5f6106d1-fef8-49b1-b7fe-6bb600da12cc', profileId: out.pid, permission: 'read_only' });
const fp2 = await call('POST', `/modules/${MODS.leads}/field-permissions`, { fieldId: '47d783ad-f9be-4e36-8c5e-e148db8801e7', profileId: out.pid, permission: 'hidden' });
out.fp = [fp1.s, fp2.s]; out.fpIds = [fp1.j && fp1.j.data && fp1.j.data.id, fp2.j && fp2.j.data && fp2.j.data.id];
const as = await call('POST', '/iam/users/45ffbc5b-7859-4c21-be9e-7b5f30747ca2/profiles', { profile_id: out.pid, scope_id: '60aeb9ce-e602-4e95-aaef-de3ceba25a3e', replace: true }); out.assign = as.s + ' ' + as.t.slice(0, 120);
return out;
