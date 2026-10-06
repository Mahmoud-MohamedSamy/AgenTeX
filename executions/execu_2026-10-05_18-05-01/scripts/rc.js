// Runs a group script inside a named playwright-cli session (no shell, so code is passed intact).
// Usage: node rc.js <session> <group.js> [outJson]
// The group file is the body of `async (page) => { ... }`; prelude.js is prepended. Lines starting with // are dropped.
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const [session, file, out] = process.argv.slice(2);
const strip = f => fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => !/^\s*\/\//.test(l)).join('\n');
const body = strip(path.join(__dirname, 'prelude.js')) + '\n' + strip(file);
const pre = strip(path.join(__dirname, 'prelude.js')); const grp = strip(file);
const code = `async (page) => { const SESS = ${JSON.stringify(session)}; ${pre}
 try { ${grp}
 } catch (e) { rec('SCRIPT', 'BLOCKED', 'script stopped: ' + String(e && e.stack || e).slice(0, 400)); return done(); } }`;
const cli = path.resolve(__dirname, '../../../node_modules/@playwright/cli/playwright-cli.js');
const r = spawnSync(process.execPath, [cli, `-s=${session}`, 'run-code', '--raw', code], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, cwd: path.resolve(__dirname, '../../..') });
let res = (r.stdout || '').trim();
try { res = JSON.parse(res); if (typeof res === 'string') res = JSON.parse(res); } catch (e) { }
if (out) fs.writeFileSync(out, typeof res === 'string' ? res : JSON.stringify(res, null, 1));
if (r.stderr && r.stderr.trim()) console.error(r.stderr.trim().slice(0, 2000));
if (Array.isArray(res)) for (const x of res) console.log(`${x.id}\t${x.verdict}\t${x.note}`);
else console.log(typeof res === 'string' ? res.slice(0, 3000) : JSON.stringify(res).slice(0, 3000));
