const a = await getAgent(); const d = a.draft_definition;
return { tools: (d.tool_keys || []).filter(t => /RunAction|AllowedActions|listActions/i.test(t)), custom_action_keys: d.custom_action_keys, write_modules: (d.write_module_keys || []).length, version: a.deployed_version_no, undeployed: a.has_undeployed_changes };
