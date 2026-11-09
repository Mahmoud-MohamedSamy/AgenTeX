// Read-only: custom actions (what each one does) and the Leads pick-list fields (for a QA blueprint).
const ca = arr((await api('o', 'GET', '/workflow/custom-actions')).j?.data);
const lay = (await api('o', 'GET', `/modules/${T.LEADS}/layouts/${T.LEADS_STD}`)).j?.data;
const pl = []; JSON.stringify(lay, (k, v) => { if (v && typeof v === 'object' && /pick_?list/i.test(v.datatypeKey || v.dataType || v.type || '') && (v.apiName || v.fieldKey || v.key)) pl.push([v.apiName || v.fieldKey || v.key, (v.options || v.pickListValues || []).slice(0, 5).map(o => o.value ?? o.label ?? o)]); return v; });
return { ca: ca.map(c => ({ id: c.id, name: c.name, app: c.appKey, kind: c.kind || c.type || c.actionType, target: String(c.url || c.endpoint || c.targetUrl || c.config?.url || '').replace(/\?.*/, ''), inputs: (c.inputs || c.inputSchema || c.parameters || []).map?.(i => i.key || i.name) , active: c.isActive ?? c.active, keys: Object.keys(c).slice(0, 20) })), picklists: pl.slice(0, 15) };
