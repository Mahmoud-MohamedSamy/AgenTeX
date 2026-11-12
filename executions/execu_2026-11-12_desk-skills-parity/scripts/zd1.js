const out = {};
for (const p of ['/workflowRules?module=tickets&limit=10', '/workflows?module=tickets', '/automation/workflowRules?module=tickets', '/workflowRules/actions?module=tickets', '/workflowRules/fieldUpdates?module=tickets', '/fieldUpdates?module=tickets']) { const r = await z('GET', p); out[p] = [r.s, r.t.slice(0, 300)]; }
return out;
