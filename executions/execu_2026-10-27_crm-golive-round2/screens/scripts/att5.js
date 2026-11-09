const mk = (name, type, size) => api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: size });
const put = (u, n, t) => page.evaluate(async ([u, n, t]) => { const t0 = performance.now(); try { const r = await fetch(u, { method: 'PUT', headers: { 'Content-Type': t }, body: new Uint8Array(n) }); return r.status + ' in ' + Math.round(performance.now() - t0) + ' ms ' + (await r.text()).slice(0, 150); } catch (e) { return 'ERR ' + e.message + ' after ' + Math.round(performance.now() - t0) + ' ms'; } }, [u, n, t]);
out.cap = {};
for (const kb of (globalThis.SIZES || [1024, 3072])) {
  const n = kb * 1024; const r = await mk('qa-r2sc-' + kb + 'kb.pdf', 'application/pdf', n);
  const p = await put(r.j.data.upload_url, n, 'application/pdf'); const c = await api('POST', `/files/${r.j.data.file_id}/confirm`, { file_id: r.j.data.file_id, size_bytes: n });
  out.cap[kb + ' KB'] = { put: p, confirm: c.s, fid: r.j.data.file_id };
}
