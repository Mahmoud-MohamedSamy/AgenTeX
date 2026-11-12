const g = await api('GET', '/web-forms/' + I.wf); const d = g.j && g.j.data || {};
return { s: g.s, enabled: d.is_enabled, kind: d.kind, status: d.status, keys: Object.keys(d), share: d.definition && d.definition.share_link_enabled, keyMatch: d.embed_key === I.wfKey };
