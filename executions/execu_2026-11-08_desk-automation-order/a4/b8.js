// A4 batch 8 (12 Nov): restore the 11 Nov A4 user-round settings (u1-orig.json), then I30 (Send happiness email while ratings are off).
const R = {}; const cut = (x, n = 300) => String(typeof x === 'string' ? x : JSON.stringify(x)).slice(0, n);
const o = JSON.parse(fs.readFileSync('../a4/u1-orig.json', 'utf8'));
const cur = (await api('GET', '/desk/happiness/settings')).j.data; R.before = { is_enabled: cur.is_enabled, scope: cur.department_scope_enabled };
const ro = ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'supervisors_max', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'option_icons', 'option_label_max', 'option_text_max', 'option_image_max_bytes'];
const body = { ...o.happiness, row_version: cur.row_version }; for (const k of ro) delete body[k];
R.happinessPut = (await api('PUT', '/desk/happiness/settings', body)).s;
const now = (await api('GET', '/desk/happiness/settings')).j.data;
R.happinessDiff = Object.keys(o.happiness).filter(k => k !== 'row_version' && JSON.stringify(o.happiness[k]) !== JSON.stringify(now[k]));
const d = (await api('GET', '/desk/departments/' + D)).j.data;
const vp = await api('PATCH', '/desk/departments/' + D, { name: d.name, display_in_help_center: o.visibility !== 'private' });
R.deptVisibility = vp.s + ' now ' + (await api('GET', '/desk/departments/' + D)).j.data.visibility + ' (original ' + o.visibility + ')';
fs.appendFileSync('../ledger.md', '- ' + new Date().toISOString().slice(0, 19) + ' A4 user round cleanup: happiness restored ' + R.happinessPut + ' diff ' + JSON.stringify(R.happinessDiff) + '; Dept A visibility ' + R.deptVisibility + '\n');
// I30: ratings are off now
const r = await mkRule('I30', { kind: 'RecordCreatedOrUpdated' }, [{ type: 'SendHappinessEmail' }]);
R.I30_rule = r.s + (r.err || '');
if (r.id) {
  const t = await mkTicket('I30'); await waitExec(t.id, 1, 60); await sleep(10000);
  const raw = arr2((await api('GET', '/workflow/executions?recordId=' + t.id)).j?.data).filter(e => e.outcome === 'Fired');
  const out = []; for (const e of raw) { const x = (await api('GET', '/workflow/executions/' + e.id)).j?.data; out.push((x?.dispatches || []).map(y => [y.actionType || y.type, y.status, y.lastError || y.errorMessage || ''].join(' ').slice(0, 220))); }
  R.I30_dispatch = out;
  const h = arr2((await api('GET', '/desk/tickets/' + t.id + '/history')).j?.data).map(x => x.action).slice(0, 8); R.I30_history = h;
}
return R;
