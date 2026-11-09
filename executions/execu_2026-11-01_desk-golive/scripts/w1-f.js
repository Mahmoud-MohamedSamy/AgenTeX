// UI tour of Wave 1 screens: loads, key strings, raw keys, a11y names. Screenshots only on problems.
const o = {}; const raw = t => (t.match(/\b[a-z][a-zA-Z]+\.[a-z][a-zA-Z_]+\.[a-zA-Z_.]+\b/g) || []).filter(x => !/\.(com|software|net|org|io)\b|taviportal|anyware/.test(x)).slice(0, 5);
const pages = [
  ['W1_01', '/settings/organization/company', ['Company', 'Time']],
  ['W1_06', '/settings/rebranding/company-logo', ['Logo']],
  ['W1_14', '/settings/organization/holidays', ['Holiday', 'Active', 'Inactive']],
  ['W1_28', '/settings/users-control/agents', ['Agents', 'Invite']],
  ['W1_34', '/settings/users-control/roles', ['CEO', 'Manager', 'Agent']],
  ['W1_37', '/settings/users-control/profiles', ['Desk Agent', 'Desk Administrator']],
  ['W1_43', '/settings/users-control/teams', ['QA GL Team 2']],
  ['W1_48', '/settings/users-control/data-sharing', ['Private', 'Public']],
  ['W1_49', '/settings/users-control/ticket-access', ['Data sharing for tickets', 'Public access scope', 'Share data with peers', 'Ticket status types']],
  ['W1_55', '/settings/security/audit-log', ['QA GL']],
  ['W1_57', '/settings/my-profile', ['Profile']],
  ['W1_58', '/settings/personal/signatures', ['Signature']],
];
for (const [id, u, need] of pages) { const r = { u };
  try { await page.goto(H + u, { waitUntil: 'commit', timeout: 45000 }); let t = ''; for (let i = 0; i < 25; i++) { await sleep(1000); t = await txt().catch(() => ''); if (t.length > 500 && !/Loading…\s*$/.test(t)) break; } await sleep(1500); t = await txt();
    if (/^Sign in/.test(t.trim())) { r.err = 'SIGNED_OUT'; o[id] = r; break; }
    r.final = page.url().replace(H, ''); r.missing = need.filter(s => !t.includes(s)); r.raw = raw(t); r.len = t.length;
    r.unnamed = await page.$$eval('button,[role=switch],input,select', es => es.filter(e => e.offsetParent !== null && !(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || (e.innerText || '').trim() || (e.id && document.querySelector('label[for="' + e.id + '"]')) || e.closest('label') || e.getAttribute('placeholder') || e.getAttribute('title'))).length);
    if (r.missing.length || r.raw.length || r.final !== u) r.shot = await shot('wave1/' + id + '-' + u.replace(/[^a-z]+/gi, '_').slice(-30));
  } catch (e) { r.err = String(e.message).slice(0, 100); }
  o[id] = r; }
return done(o);
