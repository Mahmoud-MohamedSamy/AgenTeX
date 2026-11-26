// Desk Blueprint regression runner (NDC-Staging). Usage: node rr.js <checks/xx.js> [more.js ...]
// Prepends lib.js. Gives scripts: api (owner), as(label) -> api for another account, sleep, arr, fs, log, R(caseId, verdict, note, extra).
// Each account signs in once; tokens are kept in %TEMP%/qa-tavi-tokens and refreshed (never printed).
// Results append to $RUN/out/results.jsonl (default: executions/execu_2026-11-24_desk-bp-regression).
const fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.resolve(__dirname, '../..');
const RUN = process.env.RUN || path.join(ROOT, 'executions/execu_2026-11-24_desk-bp-regression');
fs.mkdirSync(path.join(RUN, 'out'), { recursive: true });
const SD = process.env.QA_TOKEN_DIR || path.join(os.tmpdir(), 'qa-tavi-tokens'); fs.mkdirSync(SD, { recursive: true });
const API = 'https://staging-desk.taviportal.com/api/v1';
const TENANT = process.env.TENANT || 'a7a7a7a7-0000-0000-0000-000000000004';
const CSV = path.join(ROOT, 'docs/Credentials/TAVI Desk Credentials.csv');
const redact = t => String(t).replace(/((?:token|secret|password|api_key)[A-Za-z_]*\\*"\s*:\s*\\*")[^"\\]+/gi, '$1<masked>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt>');

const sessions = {};
function session(label, tenant = TENANT) {
  const key = label + '@' + tenant;
  if (sessions[key]) return sessions[key];
  const store = path.join(SD, 'tok-' + label.replace(/[^a-z0-9]/gi, '_') + (tenant !== TENANT ? '_' + tenant.slice(-4) : '') + (process.env.LANE ? '_' + process.env.LANE : '') + '.json');
  let tok = fs.existsSync(store) ? JSON.parse(fs.readFileSync(store, 'utf8')) : {};
  const H = { 'content-type': 'application/json', 'x-app-key': 'desk', 'x-tenant-id': tenant };
  const save = () => fs.writeFileSync(store, JSON.stringify(tok));
  async function login() {
    let r;
    if (label === 'anyware-owner') { // other tenant (read-only cross-tenant checks): automation/.auth/extra-credentials.csv name,url,username,password
      const x = fs.readFileSync(path.join(ROOT, 'automation/.auth/extra-credentials.csv'), 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(',')).find(c => /staging-desk/.test(c[1]));
      if (x) r = [label, x[2], ...x.slice(3)];
    } else r = fs.readFileSync(CSV, 'utf8').split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split(',')).find(x => x[0] === label);
    if (!r) throw new Error('no such label ' + label);
    const res = await fetch(API + '/iam/auth/login', { method: 'POST', headers: H, body: JSON.stringify({ email: r[1].trim(), password: r.slice(2).join(',').trim(), device_label: 'qa-automation', remember_me: true }) });
    if (res.status === 429) throw new Error('RATE_LIMITED');
    const j = await res.json().catch(() => ({})); if (!j.data || !j.data.access_token) throw new Error('sign-in failed ' + label + ' ' + res.status);
    tok = { a: j.data.access_token, r: j.data.refresh_token, at: Date.now(), logins: (tok.logins || 0) + 1 }; save();
  }
  async function refresh() {
    if (!tok.r) return login();
    const res = await fetch(API + '/iam/auth/refresh', { method: 'POST', headers: H, body: JSON.stringify({ refresh_token: tok.r }) });
    const j = await res.json().catch(() => ({}));
    if (res.status === 200 && j.success && j.data && j.data.access_token) { tok = { ...tok, a: j.data.access_token, r: j.data.refresh_token || tok.r, at: Date.now() }; save(); }
    else await login();
  }
  const ensure = async () => { if (!tok.a || Date.now() - (tok.at || 0) > 4 * 60000) await refresh(); };
  const call = async (m, p, body, opt = {}) => {
    await ensure();
    for (let i = 0; i < 3; i++) {
      try {
        const hdr = { ...H, ...(opt.noAuth ? {} : { authorization: 'Bearer ' + (opt.token || tok.a) }), ...(opt.headers || {}) };
        const r = await fetch(API + p, { method: m, headers: hdr, body: body !== undefined ? JSON.stringify(body) : undefined });
        const t = await r.text(); let j = null; try { j = JSON.parse(t); } catch (e) { }
        if (r.status === 401 && i === 0 && !opt.noAuth && !opt.token) { await refresh(); continue; }
        if ((r.status === 502 || r.status === 503 || r.status === 504) && i < 2) { await new Promise(r => setTimeout(r, 4000)); continue; }
        return { s: r.status, j, t: t.slice(0, 4000) };
      } catch (e) { if (i === 2) return { s: 0, j: null, t: 'NETWORK ' + e.message }; await new Promise(r => setTimeout(r, 4000)); }
    }
  };
  call.token = () => tok.a; call.label = label;
  return (sessions[key] = call);
}

const RES = path.join(RUN, 'out/results.jsonl');
const R = (id, verdict, note, extra = {}) => {
  const row = { id, verdict, note: redact(note), at: new Date().toISOString(), ...extra };
  fs.appendFileSync(RES, JSON.stringify(row) + '\n');
  console.log(`${id.padEnd(8)} ${verdict.padEnd(12)} ${redact(note).slice(0, 220)}`);
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const arr = x => Array.isArray(x) ? x : (x && (x.items || x.data || x.results || x.records)) || [];
const log = (...a) => console.log(redact(a.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ')));

(async () => {
  const lib = fs.readFileSync(path.join(__dirname, 'lib.js'), 'utf8');
  for (const file of process.argv.slice(2)) {
    console.log('==== ' + file);
    const AF = Object.getPrototypeOf(async function () { }).constructor;
    const body = lib + '\n;\n' + fs.readFileSync(path.resolve(file), 'utf8');
    try {
      const out = await new AF('api', 'as', 'sleep', 'arr', 'fs', 'log', 'R', 'RUN', 'require', body)(session('ndc-staging-owner'), session, sleep, arr, fs, log, R, RUN, require);
      if (out !== undefined) console.log(redact(JSON.stringify(out, null, 1)).slice(0, 6000));
    } catch (e) { console.error('SCRIPT ERROR in ' + file + ': ' + redact(String(e.stack || e)).slice(0, 1200)); }
  }
})();
