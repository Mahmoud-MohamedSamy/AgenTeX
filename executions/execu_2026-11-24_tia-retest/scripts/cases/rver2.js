const a = await getAgent(); const base = JSON.parse(fs.readFileSync(RUN + '/out/baseline-crm.json', 'utf8')).agent;
const now = a.definition || a.deployed_definition || a.draft_definition;
return { before: base.def.guardrails, now: now.guardrails };
