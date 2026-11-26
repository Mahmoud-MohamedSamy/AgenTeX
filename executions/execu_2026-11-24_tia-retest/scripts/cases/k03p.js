const out = {};
for (const p of [`/modules/${M.tickets}/field-permissions`, `/modules/${M.tickets}/field-permissions/effective`, `/modules/${M.leads}/field-permissions`, `/iam/profiles/${DESK_AGENT_PROFILE}/field-permissions`]) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.t || '').slice(0, 400); }
return out;
