// Snapshot of everything the serial window and the Wave 1 leftovers can touch.
const get = async (p, app) => { const h = app ? { ...H, 'x-app-key': app } : H; const r = await rq.fetch(B + p, { headers: h, failOnStatusCode: false }); const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) {} return r.status() === 200 ? (j && j.data !== undefined ? j.data : j) : { status: r.status(), err: t.slice(0, 200) }; };
const out = {};
out.deskStatus = await get('/desk/integrations/crm/status');
out.deskConfig = await get('/desk/integrations/crm/config');
out.company = await get('/iam/tenant/company-profile');
out.businessHours = await get('/iam/tenant/business-hours');
out.bhProfiles = await get('/iam/tenant/business-hours/profiles');
out.hierarchy = await get('/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org');
for (const k of ['max_concurrent', 'idle_timeout_minutes', 'absolute_timeout_minutes']) out['session_' + k] = await get(`/settings/resolved?app_key=iam&key=iam.security.session.${k}&scope_type=Org`);
const users = await get('/iam/users?app_key=crm&limit=200');
out.users = (Array.isArray(users) ? users : users.items || []).map(u => ({ id: u.userId || u.id, email: u.email, status: u.status, manager: u.reportingManagerId, profiles: u.profileNames || u.profiles, orgUnit: u.orgUnitId }));
const profs = await get('/iam/profiles'); out.profiles = (Array.isArray(profs) ? profs : []).map(p => ({ id: p.profileId || p.id, name: p.name, rank: p.rank }));
out.leadsFieldPermissions = await get(`/modules/${MODS.leads}/field-permissions`);
out.fiscalInCompany = JSON.stringify(out.company).match(/fiscal[^,]*/gi);
return out;
