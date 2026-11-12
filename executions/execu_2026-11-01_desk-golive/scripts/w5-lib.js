const CM = '43004ce2-577f-4eda-b00a-0750fe40c3d4', AM = '784400e1-4a2a-42c2-b4f3-7ca56e79828a', KM = '0924eb24-e42a-4eab-8efd-e3428f19e882', PM = '95b45992-5beb-4f23-b619-e3ae0e304933';
const MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794'; const C1 = '34735e25-d505-41fa-9fe3-d4a67f283a9a';
const sv = v => ({ kind: 'string', value: v });
const mk = async (mod, kind, name, fields) => { const r = await api('POST', '/modules/' + mod + '/records', { data: Object.entries(fields).map(([f, v]) => ({ field: f, value: (v && v.kind) ? v : sv(v) })) }); const id = r.j && r.j.data && r.j.data.id; if (id) CREATED.push({ kind, id, name }); return { s: r.s, id, err: r.s >= 300 ? JSON.stringify(r.j && r.j.error || r.t).slice(0, 220) : '' }; };
const get = async (mod, id) => flat(D((await api('GET', '/modules/' + mod + '/records/' + id)).j) || {});
const mtxt = async () => (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
