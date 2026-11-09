const all = []; for (let p = 1; p <= 10; p++) { const l = arr((await api('o', 'GET', `desk:/desk/integrations/crm/links?kind=contact&page_size=200&page=${p}`)).j?.data); all.push(...l); if (l.length < 100) break; }
const n = all.sort((a, b) => String(a.last_synced_at).localeCompare(String(b.last_synced_at))).at(-1);
const red = s => String(s).replace(/[\w.+-]+@[\w.-]+/g, '<email>');
const show = async id => { const r = (await api('o', 'GET', `/modules/${T.CONTACTS}/records/${id}`)).j?.data; return r && { source: r.source, layout: r.created_with_layout_id, created_by: r.created_by_name, fields: (r.data || []).filter(d => d.value && d.value.kind !== 'null').map(d => d.field).join(',') }; };
return { newestLink: red(JSON.stringify({ ...n, crm_url: undefined, desk_url: undefined })).slice(0, 500), newestCrm: await show(n.crm_record_id), mine: await show('ffe47fd2-e1b4-442a-a1dd-79144860ec2b') };
