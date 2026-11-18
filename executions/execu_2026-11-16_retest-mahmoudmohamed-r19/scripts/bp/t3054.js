// NDC-3054: contact = the user's inbox (address read from the 15 Nov e1-ev.js, never printed). Dept QA AS6 Dept A. Happiness ON for DA during the test, then restored.
const SRC = fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-08_desk-automation-order/scripts/e1-ev.js', 'utf8');
const NEW = SRC.match(/const NEW='([^']+)'/)[1];
const o = { start: new Date().toISOString() }; const F = RUN + '/scripts/bp/3054.json'; const save = () => fs.writeFileSync(F, JSON.stringify(o, null, 1));
const c = await api('POST', '/modules/' + CON + '/records', { data: fields({ first_name: 'QA RT19', last_name: '3054 inbox', email: NEW }) }); o.contact = c.j?.data?.id; if (!o.contact) return { contact: E(c) };
made.other.push({ kind: 'contact', id: o.contact }); keep(); LED('contact created ' + o.contact + ' "QA RT19 3054 inbox" (the user\'s inbox address, as on 15 Nov)'); save();
const def = { name: 'QA BP RT19 3054 close', description: 'QA RT19 retest - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: DA, entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP RT19 3054 bpclose' },
  states: [ST('Open'), ST('Closed', { isTerminal: true, position: { x: 400, y: 0 } })], transitions: [TR('close', 'Open', 'Closed', { before: { allowOwner: true } })] };
const b = await mkBp(def); o.bp = b.id; o.bpS = E(b.r); if (!b.id) { save(); return o; }
const hs = (await api('GET', '/desk/happiness/settings')).j.data; fs.writeFileSync(RUN + '/scripts/bp/3054-happiness-orig.json', JSON.stringify(hs, null, 1));
o.happinessBefore = { on: hs.is_enabled, scoped: hs.department_scope_enabled, depts: hs.department_ids };
const ro = ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'supervisors_max', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'option_icons', 'option_label_max', 'option_text_max', 'option_image_max_bytes'];
const strip = x => { const y = { ...x }; for (const q of ro) delete y[q]; return y; };
o.hOn = E(await api('PUT', '/desk/happiness/settings', strip({ ...hs, is_enabled: true, department_scope_enabled: true, department_ids: [DA] })));
LED('Customer Happiness turned ON scoped to QA AS6 Dept A for NDC-3054 (' + o.hOn + '); original saved in scripts/bp/3054-happiness-orig.json'); save();
const mk = async (s) => { const r = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: s, description: 'QA RT19 3054', department: DA, status: 'Open', priority: 'medium', owner: OWNER, contact_id: o.contact, email: NEW, channel: 'web' }) }); const id = r.j?.data?.id; if (id) { made.tickets.push(id); keep(); const n = (await rec(id)).ticket_number; LED('ticket created ' + id + ' #' + n + ' "' + s + '"'); return { id, n }; } return { err: E(r) }; };
o.tBp = await mk('QA BP RT19 3054 bpclose - closed by blueprint'); o.tNorm = await mk('QA RT19 3054 normal close - control'); save();
await sleep(8000); o.inBp = !!(await bstate(o.tBp.id));
o.closeBpAt = new Date().toISOString(); o.closeBp = E(await runT(o.tBp.id, 'close', 'Open'));
o.closeNormAt = new Date().toISOString(); o.closeNorm = E(await api('POST', '/desk/tickets/' + o.tNorm.id + '/close', {})); save();
await sleep(60000);
for (const k of ['tBp', 'tNorm']) { const id = o[k].id; o[k].status = (await rec(id)).status; o[k].hist = (await histRaw(id)).map(h => (h.occurred_at || '').slice(11, 19) + ' ' + h.action + (h.field_key ? ':' + h.field_key : '') + ' sum=' + JSON.stringify(h.summary || {}).slice(0, 120)).reverse(); o[k].feed = (await feed(id)).map(e => (e.created_at || e.occurred_at || '').slice(11, 19) + ' ' + e.action + ' ' + JSON.stringify(e.summary || {}).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '<email>').slice(0, 140)).reverse(); }
save();
const cur = (await api('GET', '/desk/happiness/settings')).j.data; const back = strip(hs); for (const q of ['row_version', 'version']) if (q in cur) back[q] = cur[q];
o.hOff = E(await api('PUT', '/desk/happiness/settings', back));
const n = (await api('GET', '/desk/happiness/settings')).j.data; o.hDiff = Object.keys(hs).filter(q => !['updated_at', 'row_version', 'version', 'updated_by'].includes(q) && JSON.stringify(hs[q]) !== JSON.stringify(n[q]));
LED('Customer Happiness restored (' + o.hOff + ', diff [' + o.hDiff.join(',') + '])'); save();
return o;
