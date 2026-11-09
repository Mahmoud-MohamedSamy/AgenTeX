const l = (await api('o', 'GET', `/modules/${T.LEADS}/layouts/b3ab6751-e26a-4641-9dbc-f8737f26c908`)).j?.data; const out = [];
JSON.stringify(l, (k, v) => { if (v && typeof v === 'object' && (v.tab_order !== undefined || v.tabOrder !== undefined || v.columns !== undefined) && (v.name || v.label || v.title)) out.push([v.name || v.labels?.en || v.label?.en || v.title, Array.isArray(v.columns) ? v.columns.length + ' columns' : v.columns ?? v.column_count, v.tab_order ?? v.tabOrder]); return v; });
return { sections: out.slice(0, 12), updated: l?.updatedAt || l?.updated_at };
