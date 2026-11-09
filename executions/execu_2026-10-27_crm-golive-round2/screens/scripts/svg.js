const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><text x="10" y="35">QA R2SC svg</text><script>document.title="QA-R2SC-SCRIPT-RAN";window.__qa={origin:location.origin,cookieReadable:document.cookie.indexOf("aw_staging_access_token")>=0};</script></svg>';
const r = await api('POST', '/files', { app_key: 'crm', purpose: 'attachment', ownership_class: 'tenant_file', original_filename: 'qa-r2sc-script.svg', declared_content_type: 'image/svg+xml', declared_size_bytes: svg.length });
const fid = r.j.data.file_id;
out.put = await page.evaluate(async ([u, b]) => (await fetch(u, { method: 'PUT', headers: { 'Content-Type': 'image/svg+xml' }, body: b })).status, [r.j.data.upload_url, svg]);
out.confirm = (await api('POST', `/files/${fid}/confirm`, { file_id: fid, size_bytes: svg.length })).s;
const a = await api('POST', `/modules/${L}/records/${REC}/attachments`, { file_id: fid, file_name: 'qa-r2sc-script.svg', content_type: 'image/svg+xml', size: svg.length });
out.attach = a.s; out.attId = a.j && a.j.data && a.j.data.id; out.fid = fid;
const d = await api('POST', `/files/${fid}/download`, { file_id: fid, vouching_app_key: 'crm' });
const url = new URL(d.j.data.download_url, B).href;
out.urlShape = url.replace(/[?].*/, '?<signature>').replace(/[0-9a-f]{8}-[0-9a-f-]{27}/g, '{id}');
const p2 = await ctx.newPage();
await p2.goto(url, { waitUntil: 'load' }); await sleep(1500);
out.opened = await p2.evaluate(() => ({ title: document.title, origin: location.origin, qa: window.__qa || null }));
await p2.screenshot({ path: RAW + 'svg-script-opened.png' });
await p2.close();
// web preview variant used by the record page
const d2 = await api('POST', `/files/${fid}/download`, { file_id: fid, vouching_app_key: 'crm', variant: 'web' }); out.webVariant = d2.s;
