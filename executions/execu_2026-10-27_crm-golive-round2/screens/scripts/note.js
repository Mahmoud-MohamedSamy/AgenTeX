const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', REC = '63a27a2d-8b88-4cd0-a74b-1e5e3afcd632';
const atts = (await api('GET', `/modules/${L}/records/${REC}/attachments`)).j.data;
const pdf = atts.find(x => x.file_name === 'qa-r2sc.pdf'), png = atts.find(x => x.file_name === 'qa-r2sc.png');
// note with two attachments
const n1 = await api('POST', `/modules/${L}/records/${REC}/notes`, { body: 'QA R2SC note with files', attachments: [{ file_id: pdf.file_id, file_name: 'qa-r2sc.pdf', content_type: 'application/pdf', size: 64 }, { file_id: png.file_id, file_name: 'qa-r2sc.png', content_type: 'image/png', size: 64 }] });
out.note = { s: n1.s, t: n1.t.slice(0, 600) };
// note with a txt (server-refused type) and with a ghost file id
const n2 = await api('POST', `/modules/${L}/records/${REC}/notes`, { body: 'QA R2SC note txt', attachments: [{ file_id: 'ce322ed6-ccce-48b6-9777-e209ea5470d8', file_name: 'qa-r2sc.txt', content_type: 'text/plain', size: 37 }] });
out.noteTxt = { s: n2.s, t: n2.t.slice(0, 400) };
const n3 = await api('POST', `/modules/${L}/records/${REC}/notes`, { body: 'QA R2SC note ghost', attachments: [{ file_id: '00000000-0000-4000-8000-000000000002', file_name: 'qa-r2sc-ghost2.pdf', content_type: 'application/pdf', size: 5 }] });
out.noteGhost = { s: n3.s, t: n3.t.slice(0, 300) };
const n4 = await api('POST', `/modules/${L}/records/${REC}/notes`, { body: '', attachments: [] });
out.noteEmpty = { s: n4.s, t: n4.t.slice(0, 300) };
await sleep(4000);
const fd = await api('GET', `/timeline/records/leads/${REC}/feed`);
out.feed = (fd.j && fd.j.data && fd.j.data.data || []).slice(0, 12).map(e => ({ type: e.type || e.entry_type || e.event_type, summary: JSON.stringify(e).slice(0, 260) }));
