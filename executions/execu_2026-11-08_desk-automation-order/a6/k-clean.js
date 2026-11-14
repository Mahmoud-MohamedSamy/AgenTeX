// Undo k-setup.js: tickets, workflow rule, blueprint, contact; restore Customer Happiness from k-orig.json.
const n = require('./bp/ndc'); const { call } = n; const M = require('./k-made.json'); const O = require('./k-orig.json');
const TK = '88e8ea44-1658-4df3-9930-d0902b91073d', CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
(async () => {
  const c = [];
  for (const [k, t] of Object.entries(M.tickets)) c.push(k + ':' + (await call('owner', 'DELETE', `/modules/${TK}/records/${t.id}`)).status);
  if (M.rule) c.push('rule:' + (await call('owner', 'DELETE', `/workflow/rules/${M.rule}`)).status);
  if (M.blueprint) { await call('owner', 'POST', `/desk/blueprints/${M.blueprint}/revoke`, { ticket_ids: null, after: null }); c.push('bp:' + (await call('owner', 'DELETE', `/modules/${TK}/blueprints/${M.blueprint}`)).status); }
  if (M.contact) c.push('contact:' + (await call('owner', 'DELETE', `/modules/${CONTACTS}/records/${M.contact}`)).status);
  const cur = (await call('owner', 'GET', '/desk/happiness/settings')).json.data;
  const ro = ['expiry_days_min', 'expiry_days_max', 'question_max_length', 'public_page_configured', 'supervisors_max', 'closed_email_subject_max', 'closed_email_body_max', 'resend_after_hours_max', 'option_icons', 'option_label_max', 'option_text_max', 'option_image_max_bytes'];
  const hb = { ...O.happiness, row_version: cur.row_version }; for (const k of ro) delete hb[k];
  c.push('happiness:' + (await call('owner', 'PUT', '/desk/happiness/settings', hb)).status);
  const now = (await call('owner', 'GET', '/desk/happiness/settings')).json.data;
  const diff = Object.keys(O.happiness).filter(k => k !== 'row_version' && JSON.stringify(O.happiness[k]) !== JSON.stringify(now[k]));
  console.log(c.join(' '), '| happiness diff vs original:', diff.length ? diff.join(',') : 'none');
})();
