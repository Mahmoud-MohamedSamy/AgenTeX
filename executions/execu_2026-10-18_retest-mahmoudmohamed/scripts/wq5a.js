const f = await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/fields');
const i = f.t.indexOf('riority'); return done({ s: f.s, head: f.t.slice(0, 300), around: f.t.slice(Math.max(0, i - 300), i + 900) });
