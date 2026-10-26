await sleep(45000);
const B = '/desk/integrations/crm', DC = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const links = arr((await api('GET', `${B}/links?kind=contact&limit=200`)).j?.data).filter(l => /d9a7b0fa|14318a6e/.test(JSON.stringify(l))).map(l => ({ id: l.id, crm: l.crm_record_id, desk: l.desk_record_id, status: l.sync_status, src: l.match_source }));
const recs = []; for (let p = 1; p < 4; p++) { const r = arr((await api('GET', `/modules/${DC}/records?page=${p}&per_page=200&sort=created_at&order=desc`)).j?.data); for (const x of r) { const d = Object.fromEntries((x.data || []).map(e => [e.field, e.value?.value])); if (/qa\.rt\.(2393|2403)/.test(d.email || '')) recs.push({ id: x.id, first: d.first_name, last: d.last_name, email: d.email, title: d.title }); } if (r.length < 200) break; }
const fails = arr((await api('GET', `${B}/failures?limit=50`)).j?.data).filter(f => /14318a6e|2403/.test(JSON.stringify(f))).map(f => (f.kind || '') + ' ' + (f.last_error || '').slice(0, 200));
return done({ links, recs, fails });
