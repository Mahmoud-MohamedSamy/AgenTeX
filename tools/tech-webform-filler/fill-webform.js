#!/usr/bin/env node
// Fills a TAVI Desk web form (default: "Tech Webform") once per row of an Excel (.xlsx) or CSV sheet,
// exactly like a visitor would: opens the form's iframe page in a browser, types each value, clicks Send,
// and records what the form answered. Each successful row creates a real ticket in the form's department.
//
// Usage:
//   node fill-webform.js --file tickets.xlsx            send every row
//   node fill-webform.js --file tickets.xlsx --dry-run  fill every row but do NOT click Send (nothing is created)
//   options: --sheet <name>   sheet to read (default: first sheet)
//            --rows 2-5       only these data rows (1 = first row under the header)
//            --headed         show the browser window
//            --delay <ms>     pause between rows (default 1500)
//            --url <iframe>   another form's iframe address (default: Tech Webform)
//            --browser edge|chrome|chromium   (default edge)
//
// Sheet layout: row 1 = headers named like the form's labels (Subject, Classification, First Name, Last Name,
// Phone, Email, Priority, Description, Skills, Due Date, Sub Category, Category). Extra columns are ignored,
// empty cells are skipped. "Skills" takes several values separated by ";" (or ","). "Attachments" takes file
// paths separated by ";". Results are written next to the sheet as <sheet>-results-<time>.csv.

const fs = require('fs'), path = require('path');

const DEFAULT_URL = 'https://staging-crm.taviportal.com/embed/feedback/index.html?key=fw1.a7a7a7a7000000000000000000000004.fQ_pa7EiH9UYXmzyT9drANidVpX5goeEBGREfrRnf8U&mode=frame';

// ---------- arguments ----------
const argv = process.argv.slice(2);
const arg = (name, def) => { const i = argv.indexOf('--' + name); if (i < 0) return def; const v = argv[i + 1]; return v && !v.startsWith('--') ? v : true; };
const FILE = arg('file');
if (!FILE || FILE === true) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 20).map(l => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }
const DRY = !!arg('dry-run', false), HEADED = !!arg('headed', false);
const DELAY = +arg('delay', 1500), URL = arg('url', DEFAULT_URL), SHEET = arg('sheet', null), BROWSER = arg('browser', 'edge');
const ROWS = (() => { const r = arg('rows', null); if (!r || r === true) return null; const [a, b] = String(r).split('-').map(Number); return [a, b || a]; })();

// ---------- playwright: use the repo's copy if present, else a local install ----------
function loadPlaywright() {
  const tries = [path.join(__dirname, '..', '..', 'node_modules', 'playwright-core'), path.join(__dirname, '..', '..', 'node_modules', 'playwright'), 'playwright-core', 'playwright'];
  for (const t of tries) { try { return require(t); } catch (e) { } }
  console.error('Playwright not found. Run "npm install playwright-core" in this folder.'); process.exit(1);
}

// ---------- read the sheet ----------
const norm = s => String(s == null ? '' : s).replace(/\*/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
function cellText(v) {
  if (v == null) return '';
  if (v instanceof Date) return v;
  if (typeof v === 'object') { if (v.text) return String(v.text); if (v.richText) return v.richText.map(r => r.text).join(''); if (v.result != null) return cellText(v.result); if (v.hyperlink) return String(v.hyperlink); }
  return typeof v === 'number' ? v : String(v).trim();
}
function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += c;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(x => String(x).trim() !== ''));
}
async function readSheet(file) {
  const ext = path.extname(file).toLowerCase();
  let grid;
  if (ext === '.csv') grid = parseCsv(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
  else {
    const ExcelJS = require('exceljs'); const wb = new ExcelJS.Workbook(); await wb.xlsx.readFile(file);
    const ws = SHEET ? wb.getWorksheet(SHEET) : wb.worksheets[0];
    if (!ws) throw new Error('Sheet not found: ' + SHEET);
    grid = []; ws.eachRow({ includeEmpty: false }, r => { const vals = []; for (let c = 1; c <= ws.columnCount; c++) vals.push(cellText(r.getCell(c).value)); grid.push(vals); });
  }
  const headers = grid[0].map(h => String(h).trim());
  const data = grid.slice(1).map((r, i) => ({ n: i + 1, cells: Object.fromEntries(headers.map((h, k) => [h, r[k] == null ? '' : r[k]])) }))
    .filter(r => Object.values(r.cells).some(v => String(v).trim() !== ''));
  return { headers, data };
}

// ---------- value helpers ----------
const pad = n => String(n).padStart(2, '0');
function toDateValue(v, inputType) {
  let d = null;
  if (v instanceof Date) d = v;
  else if (typeof v === 'number') d = new Date(Math.round((v - 25569) * 86400000)); // Excel serial date
  else if (String(v).trim()) { const s = String(v).trim(); if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2})?/.test(s)) return inputType === 'date' ? s.slice(0, 10) : s.replace(' ', 'T').slice(0, 16); d = new Date(s); }
  if (!d || isNaN(d)) return null;
  // Excel dates are stored as UTC midnight/time: read them back in UTC so the typed value matches the cell
  const y = d.getUTCFullYear(), m = pad(d.getUTCMonth() + 1), day = pad(d.getUTCDate()), hh = pad(d.getUTCHours()), mm = pad(d.getUTCMinutes());
  return inputType === 'date' ? `${y}-${m}-${day}` : `${y}-${m}-${day}T${hh}:${mm}`;
}
const splitList = v => String(v).split(/[;,]/).map(s => s.trim()).filter(Boolean);

// ---------- fill one row ----------
async function fillRow(page, cells) {
  const notes = [];
  // map each visible form label -> its control
  const fields = await page.$$eval('form label', ls => ls.map(l => ({ text: l.innerText.trim(), for: l.htmlFor || '' })));
  const byLabel = {}; for (const f of fields) if (f.for) byLabel[f.text.replace(/\*/g, '').trim().toLowerCase()] = f.for;
  for (const [header, raw] of Object.entries(cells)) {
    const key = norm(header); if (raw === '' || raw == null) continue;
    if (key === 'attachments') {
      const files = splitList(raw).map(p => path.resolve(path.dirname(FILE), p));
      const missing = files.filter(f => !fs.existsSync(f)); if (missing.length) { notes.push('attachment not found: ' + missing.join(', ')); continue; }
      const input = page.locator('form input[type=file]').first();
      if (await input.count()) { await input.setInputFiles(files); } else notes.push('form has no attachment field');
      continue;
    }
    const id = byLabel[key];
    if (!id) {
      // checkbox group (e.g. Skills): each option is its own label wrapping a checkbox
      const wanted = splitList(raw); let ticked = 0; const missing = [];
      for (const w of wanted) {
        const lab = page.locator('form label').filter({ hasText: w }); const n = await lab.count(); let hit = null;
        for (let i = 0; i < n; i++) { if (norm(await lab.nth(i).innerText()) === norm(w)) { hit = lab.nth(i); break; } }
        const cb = hit ? hit.locator('input[type=checkbox]') : null;
        if (cb && await cb.count()) { await cb.check(); ticked++; } else missing.push(w);
      }
      if (!ticked) notes.push(`column "${header}" is not a field on this form (value skipped)`);
      else if (missing.length) notes.push(`"${header}": not an option on the form: ${missing.join(', ')}`);
      continue;
    }
    const el = page.locator(`[id="${id}"]`);
    const tag = await el.evaluate(e => e.tagName); const type = await el.evaluate(e => e.type || '');
    if (tag === 'SELECT') {
      const opts = await el.evaluate(e => [...e.options].map(o => ({ v: o.value, t: o.text.trim() })));
      const want = splitList(raw); const multiple = await el.evaluate(e => e.multiple);
      const vals = (multiple ? want : [String(raw).trim()]).map(w => (opts.find(o => norm(o.v) === norm(w) || norm(o.t) === norm(w)) || {}).v).filter(v => v != null && v !== '');
      if (!vals.length) { notes.push(`"${header}": "${raw}" is not an option (${opts.filter(o => o.v).map(o => o.t).join(' / ')})`); continue; }
      await el.selectOption(multiple ? vals : vals[0]);
    } else if (/date|time/.test(type)) {
      const v = toDateValue(raw, type); if (!v) { notes.push(`"${header}": cannot read date "${raw}"`); continue; }
      await el.fill(v);
    } else if (type === 'checkbox') {
      if (/^(y|yes|true|1|x)$/i.test(String(raw).trim())) await el.check(); else await el.uncheck();
    } else {
      await el.fill(raw instanceof Date ? raw.toISOString().slice(0, 10) : String(raw));
    }
  }
  return notes;
}

// ---------- main ----------
(async () => {
  const { headers, data } = await readSheet(FILE);
  const rows = data.filter(r => !ROWS || (r.n >= ROWS[0] && r.n <= ROWS[1]));
  console.log(`Sheet: ${path.basename(FILE)} · ${rows.length} row(s) · columns: ${headers.filter(Boolean).join(', ')}${DRY ? ' · DRY RUN (Send is not clicked)' : ''}`);
  if (!rows.length) return;

  const { chromium } = loadPlaywright();
  const channel = BROWSER === 'chromium' ? undefined : (BROWSER === 'chrome' ? 'chrome' : 'msedge');
  const browser = await chromium.launch({ headless: !HEADED, channel });
  const results = [];
  for (const r of rows) {
    const ctx = await browser.newContext({ viewport: { width: 900, height: 1300 } }); const page = await ctx.newPage();
    let submitResp = null;
    page.on('response', async resp => { if (resp.url().includes('/submissions') && resp.request().method() === 'POST') { let t = ''; try { t = await resp.text(); } catch (e) { } submitResp = { status: resp.status(), body: t }; } });
    const subject = r.cells[headers.find(h => norm(h) === 'subject')] || '';
    let status = 'ERROR', message = '', notes = [];
    try {
      await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.locator('form button[type=submit]').first().waitFor({ timeout: 60000 });
      notes = await fillRow(page, r.cells);
      if (DRY) { status = 'FILLED (dry run)'; message = 'not sent'; await page.screenshot({ path: path.join(path.dirname(path.resolve(FILE)), `dry-run-row-${r.n}.png`), fullPage: true }); }
      else {
        await page.locator('form button[type=submit]').first().click();
        for (let i = 0; i < 40 && !submitResp; i++) await page.waitForTimeout(500);
        await page.waitForTimeout(1500);
        const text = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ');
        if (submitResp && submitResp.status < 300) { status = 'SENT'; try { message = JSON.parse(submitResp.body).data.message; } catch (e) { message = 'submitted'; } }
        else if (submitResp) { status = 'REFUSED'; try { const j = JSON.parse(submitResp.body); message = (j.error && (j.error.message + (j.error.details ? ' ' + JSON.stringify(j.error.details) : ''))) || submitResp.body.slice(0, 300); } catch (e) { message = submitResp.body.slice(0, 300); } }
        else {
          status = 'NOT SENT';
          const bad = await page.$$eval('form input, form select, form textarea', els => els.filter(e => e.offsetParent !== null && e.type !== 'hidden' && (e.getAttribute('aria-invalid') === 'true' || (e.validity && !e.validity.valid))).map(e => { const l = e.id && document.querySelector(`label[for="${e.id}"]`); return (l ? l.innerText : e.name || e.id).replace(/\*/g, '').trim(); }));
          message = bad.length ? 'missing or invalid: ' + [...new Set(bad)].join(', ') : (text.match(/(Please[^.]*\.)/i) || [text.slice(0, 200)])[0];
        }
      }
    } catch (e) { message = e.message.split('\n')[0]; }
    results.push({ row: r.n, subject, status, message, notes: notes.join(' | ') });
    console.log(`row ${r.n}: ${status} — ${subject}${message ? ' — ' + message : ''}${notes.length ? ' [' + notes.join(' | ') + ']' : ''}`);
    await ctx.close();
    if (DELAY) await new Promise(res => setTimeout(res, DELAY));
  }
  await browser.close();
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
  const out = path.join(path.dirname(path.resolve(FILE)), `${path.basename(FILE, path.extname(FILE))}-results-${stamp}.csv`);
  const esc = v => `"${String(v).replace(/"/g, '""')}"`;
  fs.writeFileSync(out, '﻿' + ['row,subject,status,message,notes', ...results.map(x => [x.row, x.subject, x.status, x.message, x.notes].map(esc).join(','))].join('\r\n'));
  const sent = results.filter(x => x.status === 'SENT').length;
  console.log(`\nDone: ${sent} sent, ${results.length - sent} not sent. Results: ${out}`);
})().catch(e => { console.error('ERROR', e.message); process.exit(1); });
