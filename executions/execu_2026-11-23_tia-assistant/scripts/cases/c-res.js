const rs = await saveDraft(() => JSON.parse(JSON.stringify(BASEDEF.draft_definition)), { description: BASEDEF.description }); const rd = await deploy(); const a = await getAgent();
ledger(`restored Tia after C apps: ${rs.s}/${rd.s} v${a.deployed_version_no}`);
result('C-04', 'Pass', 'Policy tia.enabled back to true (v3) → RST available again within seconds of the next check; answers OK (CRM AI Features UI toggle still to check in UI pass)');
result('C-08', 'Pass', 'enabled_apps ["desk"] deployed (v16): CRM /status available:false reason not_in_app, turn TIA_NOT_IN_APP; Desk works; capabilities apps ["desk"]');
result('C-09', 'Pass', 'enabled_apps ["crm"] deployed (v17): CRM works; Desk /status not_in_app, turn TIA_NOT_IN_APP');
result('C-11', 'Pass', 'Capabilities follow enabled_apps (["desk"] then ["crm"])');
result('C-10', 'Finding', 'API accepts enabled_apps [] (draft 200, deploy 200) and treats it as all apps (CRM + Desk available). The page blocks it ("Tick at least one app"); API has no such rule. UI check pending.');
return { v: a.deployed_version_no, same: JSON.stringify(a.draft_definition) === JSON.stringify(BASEDEF.draft_definition) };
