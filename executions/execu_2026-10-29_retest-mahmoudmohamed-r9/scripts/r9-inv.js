// Round 9 cleanup inventory (READ-ONLY) on Anyware: everything named "QA RT…" created since 29 Oct 2026 (records) or named "QA RT…" (config).
const out = {}; const SINCE = '2026-10-29'; const q = s => /^QA RT/i.test(String(s || '').trim());
const val = (r, k) => { const f = (Array.isArray(r.data) ? r.data : []).find(x => x.field === k); return f && (f.value?.value ?? f.value?.stringValue ?? null); };
const name = r => ['first_name', 'last_name', 'name', 'subject', 'title', 'deal_name', 'account_name'].map(k => val(r, k)).find(v => v) || '';
const mods = arr((await api('o', 'GET', '/modules')).j?.data).map(m => ({ id: m.id, key: m.apiName || m.api_name || m.moduleKey, label: m.name || m.label?.en }));
const scan = mods.filter(m => /^(leads|contacts|deals|accounts|tasks|meetings|calls)$/.test(m.key) || /qa_rt_r9/.test(m.key));
out.records = {};
for (const m of scan) { const hits = [];
  for (let p = 1; p <= 15; p++) { const a = arr((await api('o', 'GET', `/modules/${m.id}/records?page=${p}`)).j?.data); if (!a.length) break;
    for (const r of a) if (String(r.created_at) >= SINCE && q(name(r))) hits.push({ id: r.id, n: name(r).slice(0, 50), at: String(r.created_at).slice(0, 10) });
    if (String(a.at(-1).created_at) < SINCE || a.length < 100) break; }
  out.records[m.key] = { module: m.id, items: hits }; }
const cfg = async (p, nm = x => x.name) => { const r = await api('o', 'GET', p); return { s: r.s, items: arr(r.j?.data?.data || r.j?.data).filter(x => q(nm(x))).map(x => ({ id: x.id || x.profileId || x.orgUnitId, n: nm(x) })) }; };
out.workflowRules = await cfg('/workflow/rules?take=500');
out.approvalProcesses = await cfg('/workflow/approval-processes');
out.reviewProcesses = await cfg('/workflow/review-processes');
out.assignmentRules = await cfg('/workflow/assignment-rules');
out.blueprints = {}; for (const m of [['leads', T.LEADS], ['tasks', T.TASKS]]) out.blueprints[m[0]] = await cfg(`/modules/${m[1]}/blueprints`, x => x.definition?.name || x.name);
out.layouts = await cfg(`/modules/${T.LEADS}/layouts`);
out.webForms = await cfg('/web-forms');
out.reports = await cfg('/reporting/reports?limit=200');
out.profiles = await cfg('/iam/profiles');
out.orgUnits = await cfg('/iam/org-units');
out.modules = mods.filter(m => /qa_rt_r9/.test(m.key)).map(m => ({ id: m.id, n: m.label, key: m.key }));
const dc = arr((await api('o', 'GET', 'desk:/modules/0bbb599e-013b-4465-a41e-85a324a4e3ac/records?page=1')).j?.data).filter(r => q(name(r)) || JSON.stringify(r.data).includes('QA RT')).map(r => ({ id: r.id, n: name(r) }));
out.deskContacts = dc;
out.counts = { records: Object.fromEntries(Object.entries(out.records).map(([k, v]) => [k, v.items.length])), ...Object.fromEntries(['workflowRules', 'approvalProcesses', 'reviewProcesses', 'assignmentRules', 'layouts', 'webForms', 'reports', 'profiles', 'orgUnits'].map(k => [k, out[k].items.length])), blueprints: Object.fromEntries(Object.entries(out.blueprints).map(([k, v]) => [k, v.items.length])), modules: out.modules.length, deskContacts: dc.length };
return out;
