// Usage: node rc.js <session> <script.js>  — runs body of async(page) with prelude prepended. Tokens are redacted from output.
const fs = require('fs'); const path = require('path'); const { spawnSync } = require('child_process');
const [session, file] = process.argv.slice(2);
const strip = f => fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => !/^\s*\/\//.test(l)).join('\n');
const code = `async (page) => { ${strip(path.join(__dirname, 'prelude-desk.js'))}\n try { ${strip(file)}\n } catch (e) { return 'SCRIPT ERROR ' + String(e && e.stack || e).slice(0, 800); } }`;
const cli = path.resolve(__dirname, '../../../node_modules/@playwright/cli/playwright-cli.js');
const r = spawnSync(process.execPath, [cli, `-s=${session}`, 'run-code', '--raw', code], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, cwd: path.resolve(__dirname, '../../..') });
const red = x => String(x).replace(/Bearer\s+[A-Za-z0-9._-]+/g, 'Bearer <redacted>').replace(/eyJ[A-Za-z0-9._-]{20,}/g, '<jwt redacted>').replace(/(aw_[a-z_]*token)=[^;s]+/gi, '$1=<redacted>');
let res = (r.stdout || '').trim(); try { res = JSON.parse(res); if (typeof res === 'string') res = JSON.parse(res); } catch (e) { }
if (r.stderr && r.stderr.trim()) console.error(red(r.stderr.trim().slice(0, 2000)));
console.log(red(typeof res === 'string' ? res : JSON.stringify(res, null, 1)));
