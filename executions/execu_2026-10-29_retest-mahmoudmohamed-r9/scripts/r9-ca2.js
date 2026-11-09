const ca = arr((await api('o', 'GET', '/workflow/custom-actions')).j?.data);
return ca.map(c => [c.name, c.method, String(c.path || '').replace(/\?.*/, ''), c.sourceName, c.status, (c.inputBindings || []).map(b => b.key || b.name || b.inputKey).join('/'), JSON.stringify(c.targetApps)]);
