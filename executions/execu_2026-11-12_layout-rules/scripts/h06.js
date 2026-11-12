// Help Center access mode: set to 'open' for the G17 group (user approved 12 Nov), UNDO=1 restores the saved value
const HC = '/help-centers/e74f2abb-e28d-400e-908c-f2c54862e389'; const d = (await api('GET', HC)).j.data; const out = { modeBefore: d.access.mode, rv: d.row_version };
const target = process.env.UNDO ? JSON.parse(fs.readFileSync(RUN + '/out/hc-access-before.json', 'utf8')).mode : 'open';
if (!process.env.UNDO) fs.writeFileSync(RUN + '/out/hc-access-before.json', JSON.stringify(d.access));
for (const [m, body] of [['PATCH', { access: { ...d.access, mode: target }, row_version: d.row_version }], ['PUT', { ...d, access: { ...d.access, mode: target } }]]) { const r = await api(m, HC, body); out[m] = SR(r).slice(0, 200); if (r.s < 300) break; }
out.modeAfter = (await api('GET', HC)).j.data.access.mode; LED('HC access.mode ' + out.modeBefore + ' -> ' + out.modeAfter + (process.env.UNDO ? ' (restored)' : ' (temporary, user approved; restore after G17)')); return out;
