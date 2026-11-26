// Tia knowledge-base files: upload txt/md/pdf, ask, unsupported type, oversize, delete, ask again. Restores the agent.
const BF = RUN + '/out/cr-baseline.json'; const B = JSON.parse(fs.readFileSync(BF, 'utf8')); const o = { files: {} }; const P = { page: { app: 'crm' } };
const tag = Math.random().toString(36).slice(2, 6).toUpperCase();
const pdf = text => { const stream = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET`; const objs = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  let out = '%PDF-1.4\n'; const off = []; objs.forEach((b, i) => { off.push(out.length); out += `${i + 1} 0 obj\n${b}\nendobj\n`; }); const x = out.length; out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + off.map(n => String(n).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`; return Buffer.from(out, 'latin1'); };
const facts = { txt: [`QA-KB-TXT-${tag}.txt`, 'text/plain', `The QA lounge password policy ${tag}: the Orchid lounge opens at 07:15 every day.`, 'At what time does the Orchid lounge open?', '07:15'],
  md: [`QA-KB-MD-${tag}.md`, 'text/markdown', `# QA policy ${tag}\n\nThe Lilac refund window is **47 days** for all orders.`, 'How long is the Lilac refund window?', '47'],
  pdf: [`QA-KB-PDF-${tag}.pdf`, 'application/pdf', null, 'What colour is the Saffron badge?', 'teal'] };
const upload = async (name, type, buf) => {
  const c = await api('POST', '/files', { app_key: 'salesiq', purpose: 'document', ownership_class: 'tenant_file', original_filename: name, declared_content_type: type, declared_size_bytes: buf.length });
  if (c.s >= 300) return { err: 'create ' + c.s + ' ' + (c.t || '').slice(0, 150) }; const d = c.j?.data; const url = d.upload_url.startsWith('http') ? d.upload_url : 'https://staging-crm.taviportal.com' + d.upload_url;
  const put = await fetch(url, { method: 'PUT', headers: { 'Content-Type': type }, body: buf }); const cf = await api('POST', `/files/${d.file_id}/confirm`, { file_id: d.file_id, size_bytes: buf.length });
  return { file_id: d.file_id, put: put.status, confirm: cf.s };
};
const deploy = async def => { const a = await getAgent(); const p = await api('PUT', `/agents/${a.id}/draft`, { name: a.name, description: a.description, definition: def, expected_updated_at: a.updated_at }); const d = p.s < 300 ? await api('POST', `/agents/${a.id}/deploy`, {}) : { s: '-' }; return p.s + '/' + d.s; };
const askT = async q => { const r = await ask(q, P); if (r.final?.conversation_id) await api('DELETE', `/agents/tia/conversations/${r.final.conversation_id}`); return (r.text || r.final?.text || r.error || '').slice(0, 220); };
const docIds = [];
try {
  for (const [k, [name, type, text]] of Object.entries(facts)) {
    const buf = k === 'pdf' ? pdf(`QA policy ${tag}: the Saffron badge is teal.`) : Buffer.from(text, 'utf8'); const u = await upload(name, type, buf); o.files[k] = { upload: u };
    if (u.file_id) { const r = await api('POST', '/agents/kb/documents', { file_id: u.file_id, name, size_bytes: buf.length }); o.files[k].register = r.s + ' ' + (r.s >= 300 ? (r.t || '').slice(0, 160) : ''); if (r.j?.data?.id) { docIds.push(r.j.data.id); o.files[k].doc = r.j.data.id; } }
  }
  if (docIds.length) ledger('P7 KB docs ' + docIds.join(',') + ' — delete');
  // unsupported type and oversize
  { const u = await upload(`QA-KB-CSV-${tag}.csv`, 'text/csv', Buffer.from('a,b\n1,2\n')); o.csv = { upload: u }; if (u.file_id) { const r = await api('POST', '/agents/kb/documents', { file_id: u.file_id, name: `QA-KB-CSV-${tag}.csv`, size_bytes: 8 }); o.csv.register = r.s + ' ' + (r.t || '').slice(0, 160); if (r.j?.data?.id) docIds.push(r.j.data.id); } }
  { const c = await api('POST', '/files', { app_key: 'salesiq', purpose: 'document', ownership_class: 'tenant_file', original_filename: `QA-KB-BIG-${tag}.txt`, declared_content_type: 'text/plain', declared_size_bytes: 21 * 1024 * 1024 }); o.big = { create: c.s + ' ' + (c.t || '').slice(0, 160) };
    if (c.j?.data?.file_id) { const r = await api('POST', '/agents/kb/documents', { file_id: c.j.data.file_id, name: `QA-KB-BIG-${tag}.txt`, size_bytes: 21 * 1024 * 1024 }); o.big.register = r.s + ' ' + (r.t || '').slice(0, 160); if (r.j?.data?.id) docIds.push(r.j.data.id); } }
  // wait for processing
  for (let i = 0; i < 24; i++) { const l = arr((await api('GET', '/agents/kb/documents')).j?.data).filter(d => docIds.includes(d.id)); o.status = l.map(d => d.name.slice(0, 18) + ':' + (d.status || d.state)); if (l.every(d => !/pending|processing|queued|uploading/i.test(String(d.status || d.state)))) break; await sleep(5000); }
  const okDocs = arr((await api('GET', '/agents/kb/documents')).j?.data).filter(d => docIds.includes(d.id) && /ready|indexed|done|processed|active/i.test(String(d.status || d.state))).map(d => d.id);
  const def = JSON.parse(JSON.stringify(B.agentDef)); def.kb_document_ids = okDocs; o.deployWithKb = await deploy(def); ledger('P7 KB attached to Tia — restore'); await sleep(8000);
  o.ask = {}; for (const [k, f] of Object.entries(facts)) { const t = await askT(f[3]); o.ask[k] = { right: t.toLowerCase().includes(f[4]), text: t.slice(0, 160) }; }
  // delete the documents (still referenced by the deployed definition) and ask again
  o.del = []; for (const id of docIds) o.del.push((await api('DELETE', `/agents/kb/documents/${id}`)).s); await sleep(8000);
  o.askAfterDelete = {}; for (const [k, f] of Object.entries(facts)) { const t = await askT(f[3]); o.askAfterDelete[k] = { stillKnows: t.toLowerCase().includes(f[4]), text: t.slice(0, 160) }; }
  o.agentAfterDelete = (await getAgent()).draft_definition?.kb_document_ids;
} finally {
  for (const id of docIds) await api('DELETE', `/agents/kb/documents/${id}`);
  o.restore = await deploy(B.agentDef); const a = await getAgent(); o.final = { same: JSON.stringify(a.draft_definition) === JSON.stringify(B.agentDef), ver: a.deployed_version_no, kbLeft: arr((await api('GET', '/agents/kb/documents')).j?.data).filter(d => /QA-KB-/.test(d.name)).length }; ledger('P7 KB restored ' + JSON.stringify(o.final));
}
fs.appendFileSync(RUN + '/out/p7-results.jsonl', JSON.stringify({ part: 'kb', at: new Date().toISOString().slice(0, 19), ...o }) + '\n'); return o;
