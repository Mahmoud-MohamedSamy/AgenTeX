const a = await getAgent(); const d = a?.definition || a?.draft?.definition || {};
return { version: a?.version || a?.deployed_version, keys: Object.keys(a || {}), defKeys: Object.keys(d), sample: JSON.stringify(d).replace(/"allowed_(user|profile)_ids":\[[^\]]*\]/g,'').slice(0, 2500) };
