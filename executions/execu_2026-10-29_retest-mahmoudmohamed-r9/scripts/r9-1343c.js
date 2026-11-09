const out = {}; const t = String(Date.now()).slice(-5); let ouId = null;
for (const body of [{ name: 'QA RT 1343 OU ' + t, parent_id: T.OU_TEAM1 }, { name: 'QA RT 1343 OU ' + t, parentOrgUnitId: T.OU_TEAM1 }]) { const r = await api('o', 'POST', '/iam/org-units', body); out[Object.keys(body)[1]] = r.s + ' ' + r.t.slice(0, 120); ouId = r.j?.data?.orgUnitId || r.j?.data?.id; if (ouId) break; }
if (ouId) { out.del = (await api('o', 'DELETE', '/iam/org-units/' + ouId)).s; ledger(`org unit ${ouId} (NDC-1343) created + deleted ${out.del}`); await sleep(40000);
  out.audit = arr((await api('o', 'GET', '/audit/events?app_key=iam&limit=200')).j?.data).filter(e => e.target_id === ouId).map(e => e.action + ' by ' + e.actor_label); }
return out;
