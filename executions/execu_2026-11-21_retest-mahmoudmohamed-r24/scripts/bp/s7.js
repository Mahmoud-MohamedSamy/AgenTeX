const J = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/3065.json', 'utf8'));
const a = await rec('7e784fc0-821d-4a80-8c12-3bfe25a6e89d'), b = await rec(J.k1), c = await rec('4ad8caa5-4f11-404c-b25b-8235103d4090');
const d = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const x = JSON.stringify(a[k]), y = JSON.stringify(b[k]); if (x !== y && !/time|_at$|date|number|subject|description|^id$|activity|elapsed/i.test(k)) d[k] = [String(x).slice(0, 60), String(y).slice(0, 60), String(JSON.stringify(c[k])).slice(0, 60)]; }
const t3 = (await api('GET', '/desk/tickets/' + J.r3)).j?.data?.status; const r3 = (await rec(J.r3)).status;
return { diff_4181_4808_4182: d, r3: [t3, r3] };
