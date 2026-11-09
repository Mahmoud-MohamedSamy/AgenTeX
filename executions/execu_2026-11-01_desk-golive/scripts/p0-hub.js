const out = {};
for (const p of (globalThis.__P || ['/settings/hub', '/me', '/teamspaces', '/modules', '/desk/departments', '/users?limit=200'])) {
  try { const r = await api('GET', p); out[p] = { s: r.s, j: r.j }; } catch (e) { out[p] = { s: 'ERR', j: String(e.message).slice(0, 80) }; }
}
return done(out);
