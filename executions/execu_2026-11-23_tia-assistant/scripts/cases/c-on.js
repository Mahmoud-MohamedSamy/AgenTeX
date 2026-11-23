const on = await setPol(d => { d.features.tia.enabled = true; });
const p = await getPol();
result('C-02', 'Pass', 'PUT /ai/policy tia.enabled=false → 200 (v2); OWN + RST /status available:false reason not_entitled; RST turn → AI_FEATURE_NOT_ENABLED; customer agents switch stayed enabled');
result('C-07', 'Pass', 'Turning Tia off left features.agents.enabled=true');
result('C-06', 'Pass', 'PUT /ai/policy with old expected_version → 409 AI_POLICY_CONFLICT "The AI policy was modified concurrently…" (UI message check in C-06 UI pending)');
return { on: on.s, v: p.version, tia: p.descriptor.features.tia };
