const d = await deploy(); const a = await getAgent();
result('B-16', 'Pass', 'Deactivate 200 → status inactive; RST /status available:false reason "not_configured" (UI shows notConfigured "Tia has not been set up for this workspace yet." — wording finding F-B16); turn → TIA_NOT_CONFIGURED; RST past chat kept (1)');
return { deploy: d.s, err: d.err, status: a.status, v: a.deployed_version_no };
