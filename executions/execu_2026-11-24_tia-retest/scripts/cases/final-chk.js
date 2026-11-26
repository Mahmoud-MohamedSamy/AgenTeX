const a = await getAgent(); const p = await api('GET', '/ai/policy');
const W = arr((await api('GET', '/workflow/rules?limit=300')).j?.data).filter(r => /QA TIA (CRUD|PERM)/.test(r.name || ''));
return { tiaVer: a.deployed_version_no, undeployed: a.has_undeployed_changes, dos: a.draft_definition.guardrails.dos.length, donts: a.draft_definition.guardrails.donts.length, tiaCap: p.j?.data?.descriptor?.features?.tia?.daily_credit_cap, qaRules: W.length };
