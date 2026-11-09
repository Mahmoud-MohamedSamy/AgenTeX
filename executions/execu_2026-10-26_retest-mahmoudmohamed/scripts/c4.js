const TEAM = '1adfefb7-0c25-4484-ae92-782964695054'; const out = {};
const team = ((await api('GET', '/desk/teams')).j?.data?.teams || []).find(t => t.id === TEAM); out.teamSources = team?.sources;
const disp = async id => arr((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).flatMap(e => (e.dispatches || []).map(d => d.actionType + ' ' + d.status + ' ' + String(d.responseBodyTruncated || d.lastError || '').slice(0, 200)));
for (const id of ['29049c30-eda1-46e8-a4b5-85ecbe4acc40', 'b8281686-ddab-41bc-9b71-2f038de4f59d']) { const t = await getTicket(id); out['D1 ' + id.slice(0, 8)] = { owner: t.owner, team: t.team, disp: await disp(id) }; }
const b15 = await getTicket('6d876b73-dd0c-4950-93fb-f3e45d8fb9c2'); out.B15 = { contact: b15.contact_id, disp: await disp('6d876b73-dd0c-4950-93fb-f3e45d8fb9c2') };
if (b15.contact_id) { const g = (await api('GET', `/modules/${CONTACTS}/records/${b15.contact_id}`)).j?.data; const d = {}; for (const x of g?.data || []) d[x.field] = val(x.value); out.B15.contactNow = { title: d.title, email: d.email, name: d.name, created: d.created_at }; }
const b8 = (await api('GET', `/modules/${T}/records/24754111-e875-4447-813a-38b5fe9ffe70`)).j?.data; out.B08 = { layout: b8?.layout_id || b8?.layoutId, disp: await disp('24754111-e875-4447-813a-38b5fe9ffe70') };
return fin(out);
