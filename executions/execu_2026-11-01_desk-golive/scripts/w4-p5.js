const tp = await api('GET', '/desk/community/topics?limit=20&q=' + encodeURIComponent('QA GL W4'));
out.topics = arr(D(tp.j)).map(x => { const o = {}; for (const k of Object.keys(x)) if (!/html|body|content/.test(k)) o[k] = x[k]; o.body = String(x.body_html || x.content || x.body || '').replace(/<[^>]+>/g, ' ').slice(0, 120); return o; });
for (const t of out.topics) { const r = await api('GET', '/desk/community/topics/' + t.id + '/replies'); t.replies = arr(D(r.j)).map(x => ({ id: x.id, by: x.author_name || x.author_type, txt: String(x.body_html || x.body || '').replace(/<[^>]+>/g, ' ').slice(0, 60), st: x.status })); }
const cs = await api('GET', '/desk/community/settings'); out.settings = cs.s + ' ' + JSON.stringify(D(cs.j)).slice(0, 500);
return fin({ out });
