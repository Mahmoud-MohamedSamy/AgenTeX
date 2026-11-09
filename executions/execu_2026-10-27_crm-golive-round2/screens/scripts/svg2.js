// from-scratch re-verification of R2SC-B1 with a visible marker; new QA lead, new file
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LAY = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
const s = (k, v) => ({ field: k, value: { kind: 'string', value: v } });
const lr = await api('POST', `/modules/${L}/records`, { layout_id: LAY, data: [s('name', 'QA R2SC SVG recheck'), s('first_name', 'QA R2SC SVG recheck'), s('phone', '01012340099'), s('single_line_3_9', 'QA R2SC')] });
const REC = lr.j.data.id; out.lead = REC;
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="200"><rect width="1100" height="200" fill="#fff"/><text x="20" y="40" font-size="22">QA R2SC SVG attachment</text><text id="m" x="20" y="90" font-size="22" fill="#dc2626">script did not run</text><script>var c=document.cookie.indexOf("aw_staging_access_token")>=0;document.getElementById("m").textContent="SCRIPT RAN on "+location.origin+" - access-token cookie readable: "+c;</script></svg>';
const r = await api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-r2sc-recheck.svg', declared_content_type: 'image/svg+xml', declared_size_bytes: svg.length });
const fid = r.j.data.file_id;
await page.evaluate(async ([u, b]) => fetch(u, { method: 'PUT', headers: { 'Content-Type': 'image/svg+xml' }, body: b }), [r.j.data.upload_url, svg]);
out.confirm = (await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: svg.length })).s;
out.attach = (await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: fid, file_name: 'qa-r2sc-recheck.svg', content_type: 'image/svg+xml', size: svg.length })).s;
const d = await api('POST', `/files/${fid}/download`, { file_id: fid, vouching_app_key: 'crm' });
const p2 = await ctx.newPage(); await p2.setViewportSize({ width: 1600, height: 500 });
await p2.goto(new URL(d.j.data.download_url, B).href, { waitUntil: 'load' }); await sleep(1500);
out.marker = await p2.evaluate(() => document.getElementById('m').textContent);
out.addr = p2.url().replace(/[?].*/, '?<signature>');
await p2.screenshot({ path: RAW + 'svg-recheck-opened.png' }); await p2.close();
