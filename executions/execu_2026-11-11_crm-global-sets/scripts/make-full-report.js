// Builds full-report.html: everything from the Global Sets intake + runs, in one self-contained page.
// Sources: docs/crm-global-sets/* (spec, missing list, plane draft, Zoho notes) + this run folder (results, ledgers, evidence).
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const ROOT = path.join(RUN, '..', '..');
const DOCS = path.join(ROOT, 'docs', 'crm-global-sets');
const rd = p => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const png = p => 'data:image/png;base64,' + fs.readFileSync(p).toString('base64');

// ---------- tiny markdown renderer (headings, tables, lists incl. nesting, hr, bold, code, links) ----------
function inline(s) {
  const codes = []; s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(c); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|[\s(])(https?:\/\/[^\s)<]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
}
function md(src, { shift = 1 } = {}) {
  const L = src.split('\n'); let i = 0, out = [];
  const isRow = l => /^\s*\|.*\|\s*$/.test(l);
  while (i < L.length) {
    let l = L[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)$/))) { const n = Math.min(6, m[1].length + shift); out.push(`<h${n}>${inline(m[2])}</h${n}>`); i++; continue; }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (isRow(l)) {
      const rows = []; while (i < L.length && isRow(L[i])) { rows.push(L[i]); i++; }
      const cells = r => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
      const head = cells(rows[0]); const body = rows.slice(/^\s*\|[\s:|-]+\|\s*$/.test(rows[1] || '') ? 2 : 1).map(cells);
      const emptyHead = head.every(h => !h);
      out.push(`<div class="tw"><table class="md">${emptyHead ? '' : `<thead><tr>${head.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead>`}<tbody>${body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.)\s+/.test(l)) {
      const items = []; while (i < L.length && (/^\s*([-*]|\d+\.)\s+/.test(L[i]) || (/^\s{2,}\S/.test(L[i]) && items.length))) { items.push(L[i]); i++; }
      const build = (arr, base) => { let html = '', k = 0; const ordered = /^\s*\d+\./.test(arr[0]); const start = ordered ? parseInt(arr[0].trim(), 10) : 1;
        html += ordered ? `<ol${start > 1 ? ` start="${start}"` : ''}>` : '<ul>';
        while (k < arr.length) { const ind = arr[k].match(/^\s*/)[0].length; const txt = arr[k].replace(/^\s*([-*]|\d+\.)\s+/, ''); k++;
          const kids = []; while (k < arr.length && arr[k].match(/^\s*/)[0].length > ind) { kids.push(arr[k]); k++; }
          html += `<li>${inline(txt)}${kids.length ? build(kids.filter(x => /^\s*([-*]|\d+\.)\s+/.test(x)).length ? kids : kids, ind) : ''}</li>`; }
        return html + (ordered ? '</ol>' : '</ul>'); };
      out.push(build(items, 0)); continue;
    }
    const para = []; while (i < L.length && L[i].trim() && !/^(#{1,6}\s|\s*\||---|\s*([-*]|\d+\.)\s)/.test(L[i])) { para.push(L[i]); i++; }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}

// ---------- data ----------
const spec = rd(path.join(DOCS, 'spec-crm-global-sets.md'));
const missing = rd(path.join(DOCS, 'crm-global-sets-missing-list.md'));
const zLive = rd(path.join(DOCS, 'reference', 'zoho-live-findings.md'));
const zDocs = rd(path.join(DOCS, 'reference', 'zoho-docs-inventory.md'));
const plane = rd(path.join(DOCS, 'plane-draft', 'description.html')).replace(/<!--[\s\S]*?-->/g, '');
const ledger = rd(path.join(RUN, 'ledger.md'));
const ledgerZ = rd(path.join(RUN, 'ledger-zoho.md'));
const diff = rd(path.join(RUN, 'after', 'diff.json'));

const results = new Map(); rd(path.join(RUN, 'results.tsv')).trim().split('\n').slice(1).map(l => l.split('\t')).forEach(r => results.set(r[0], r));

// split spec into sections by "## "
const secs = []; let cur = null;
spec.split('\n').forEach(l => { const m = l.match(/^## (.*)$/); if (m) { cur = { title: m[1], body: [] }; secs.push(cur); } else if (cur) cur.body.push(l); });
const front = spec.split('\n## ')[0];
const groupSecs = secs.filter(s => /^(Group [A-L]|E2E)/.test(s.title));
const zSec = secs.find(s => /^Group Z/.test(s.title)), trace = secs.find(s => /^Traceability/.test(s.title)), reporting = secs.find(s => /^Reporting/.test(s.title));
const setupSecs = secs.filter(s => /^(0 |1 |2 )/.test(s.title));

const parseRows = body => body.filter(l => /^\|\s*(?!ID\b)[A-Z][A-Za-z0-9-]*[^|]*\|/.test(l) && !/^\|\s*-/.test(l)).map(l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim()));
const ZV = { Z1: ['G2, G3, G3b, G3c', 'Replace is refused for views and skips workflows (B2, B3)'], Z2: ['F5', 'No delete route; every attempt 404'], Z3: ['D3', 'One-time Sort A–Z only'],
  Z4: ['D-editor', 'Editor has bulk add only, no predefined choices'], Z5: ['B1', 'No built-in sets in the list'], Z6: ['I1 editor screenshot', 'Address Country is a free-text box'],
  Z7: ['J4', 'not_tracked: reports'], Z8: ['J7', 'Used In is per field'], Z9: ['J8', 'List shows "n fields", no Created By'], Z10: ['C15', '51 sets created, no limit'], Z11: ['—', 'No replaced-values route or history'] };
const VCL = v => 'v-' + String(v || 'notrun').toLowerCase().replace(/\s+/g, '');
const pill = v => `<span class="pill ${VCL(v)}">${esc(v || 'Not run')}</span>`;
const used = new Set();
const groupTables = groupSecs.map(s => {
  const rows = parseRows(s.body); const hasExp = true;
  const tr = rows.map(c => { const id = c[0].split(' ')[0]; const r = results.get(id); used.add(id);
    const extra = [...results.keys()].filter(k => k !== id && k.startsWith(id) && /^[A-Z]\d+[a-z]?-|^[A-Z]\d+[a-z]$/.test(k) && !rows.some(x => x[0] === k));
    extra.forEach(k => used.add(k));
    const main = `<tr data-v="${esc(r ? r[1] : 'Not run')}"><td class="id">${esc(id)}</td><td class="tags">${esc(c.length > 3 ? c[1] : '')}</td><td>${inline(c.length > 3 ? c[2] : c[1])}</td><td>${inline(c.length > 3 ? c[3] : c[2] || '')}</td><td>${pill(r ? r[1] : 'Not run')}</td><td class="fact">${esc(r ? r[2] : 'Not run in either round.')}</td></tr>`;
    const subs = extra.map(k => { const x = results.get(k); return `<tr class="sub" data-v="${esc(x[1])}"><td class="id">${esc(k)}</td><td class="tags">extra</td><td colspan="2" class="muted">Extra check under ${esc(id)}</td><td>${pill(x[1])}</td><td class="fact">${esc(x[2])}</td></tr>`; }).join('');
    return main + subs; }).join('');
  return `<div class="grp"><h3 id="${esc(s.title.split(' — ')[0].replace(/\s+/g, '-').toLowerCase())}">${esc(s.title)}</h3><div class="tw"><table class="res"><thead><tr><th>Row</th><th>Tags</th><th>Steps</th><th>Expected</th><th>Verdict</th><th>What happened</th></tr></thead><tbody>${tr}</tbody></table></div></div>`;
}).join('');
const leftovers = [...results.keys()].filter(k => !used.has(k));
const leftoverHtml = leftovers.length ? `<div class="grp"><h3>Extra checks not in the spec tables</h3><div class="tw"><table class="res"><thead><tr><th>Row</th><th>Verdict</th><th>What happened</th></tr></thead><tbody>${leftovers.map(k => { const x = results.get(k); return `<tr data-v="${esc(x[1])}"><td class="id">${esc(k)}</td><td>${pill(x[1])}</td><td class="fact">${esc(x[2])}</td></tr>`; }).join('')}</tbody></table></div></div>` : '';
const zRows = parseRows(zSec.body).map(c => `<tr data-v="Gap"><td class="id">${esc(c[0])}</td><td>${inline(c[1])}</td><td>${inline(c[2])}</td><td>${inline(c[3])}</td><td>${pill('Gap')}</td><td class="fact">${esc((ZV[c[0]] || ['', ''])[1])} <span class="muted">(${esc((ZV[c[0]] || ['', ''])[0])})</span></td></tr>`).join('');

const count = {}; results.forEach(r => count[r[1]] = (count[r[1]] || 0) + 1);
const VORD = ['Pass', 'Fail', 'Gap', 'Info', 'Blocked', 'Inconclusive', 'Not run'];
const notrunSpec = groupSecs.flatMap(s => parseRows(s.body).map(c => c[0].split(' ')[0])).filter(id => !results.has(id));
notrunSpec.forEach(() => count['Not run'] = (count['Not run'] || 0) + 1);
const total = Object.values(count).reduce((a, b) => a + b, 0);
const bar = VORD.filter(v => count[v]).map(v => `<span class="seg ${VCL(v)}" style="flex:${count[v]}" title="${v}: ${count[v]}"></span>`).join('');
const chips = VORD.filter(v => count[v]).map(v => `<button class="chip" type="button" data-f="${v}" aria-pressed="false"><span class="dot ${VCL(v)}"></span>${v} <b>${count[v]}</b></button>`).join('');

const bugs = [
  { id: 'B1', sev: 'High', title: 'A new pick list field can\'t use a global set', rows: 'I1 (J3 shows an existing linked field works)',
    steps: ['Open Leads › Standard layout editor.', 'Drag in a Pick List field.', 'Edit Properties › Advanced › Global set = "QA GS1111 Tier". The set\'s values appear.', 'Click Save.'],
    exp: 'The field is created and linked to the set. Zoho: Pick List Type = Global Set, saved through the API (201, linked). NDC-2806 S4: "linking new or existing picklists".',
    act: 'Error "Field \'…\': Option \'global_set_id\' is not supported for datatype \'pick_list\'." Nothing is saved. POST /modules/{id}/fields returns the same 400.', note: 'Workaround: create a local pick list, then Associate it with the set.', img: 'B1-new-field-from-global-set-vs-zoho.png' },
  { id: 'B2', sev: 'High', title: 'Replace leaves workflow rules on the old value', rows: 'G3, G3b, G3c, K5b, F1',
    steps: ['Rule: criteria Tier = Bronze, action set Tier = Silver.', 'Replace Bronze → Gold; replace Silver → Gold.', 'Switch the rule on and create a lead with Tier = Gold.'],
    exp: 'Criteria and actions follow the new value. Zoho\'s Replace note: "Records, Criteria, Workflow Actions, Field Dependency"; its field update changed to Gold live. NDC-2806 S3.',
    act: 'Records move, but the rule still says Bronze and still sets Silver, both now unused. The rule stops matching, and when it runs it writes Silver onto a new lead. Removing a value used by a rule gives no warning.', note: '', img: 'B2-replace-leaves-workflow-rules-on-old-value-vs-zoho.png' },
  { id: 'B3', sev: 'Medium', title: 'Replace is refused when a custom view filters on the value', rows: 'G2, F7, E2E-1',
    steps: ['Create a Leads view filtering on Tier = Gold.', 'Edit the set, Replace Gold → Silver Plus.'],
    exp: 'The view filter changes to the new value and the record stays in the view (Zoho, seen live). NDC-2806 S3.',
    act: '"Gold" is used by custom view filters. Change or remove it in those views first. Also seen in retest round 15 (10 Nov).', note: '', img: 'B3-replace-blocked-by-custom-view-vs-zoho.png' },
  { id: 'B4', sev: 'Low', title: 'A save without the version number overwrites the set (possible)', rows: 'D8',
    steps: ['PUT /global-sets/{id} without row_version.'], exp: 'Refused like a stale save (409).', act: '200, the set is overwritten. The screen always sends the version, so only API clients are exposed.', note: '', img: null },
  { id: 'B5', sev: 'Low', title: 'Two editor labels are not translated in Arabic', rows: 'L4',
    steps: ['Switch the language to العربية.', 'Open Global Sets and edit a set.'], exp: 'Every label in Arabic, page right-to-left.',
    act: 'Right-to-left and mostly translated, but "VALUES (2)" and "Move 0 to used values" stay in English.', note: 'The owner account was switched back to English.', img: null, raw: 'L4-ar-editor.png' },
  { id: 'B6', sev: 'High', title: "Replace does not update reports: the filter keeps the old value and the result is stale", rows: "J4, J4b",
    steps: ["Create a Leads report filtering QA field = Gold (2 leads).","Replace Gold → Silver in the set.","Run the report again, then after another lead is edited."], exp: "The report filter follows the new value and lists the leads under it. Zoho, seen live: the filter changed to \"IS Silver\" and the report showed all 3 leads. NDC-2806 S3 names reports.",
    act: "Replace is allowed (reports are not tracked). The filter stays \"Gold\"; for 70+ s the report kept returning 2 stale \"Gold\" rows, then 0 rows after an unrelated edit. After a rename the report shows the stored value, not the new label.", note: "", img: "B6-replace-does-not-update-reports-vs-zoho.png" },
  { id: 'B7', sev: 'High', title: "Replace does not update field dependency maps", rows: "G4, J5b",
    steps: ["Create dependency maps with a set field as parent (Gold→X, Silver→Y) and as child (P→Gold, Silver).","Replace Gold → Bronze."], exp: "The maps follow the new value. Zoho, seen live: Gold was removed from the map and its child values merged into the new value; records stayed valid.",
    act: "Both maps still use \"Gold\" (now unused). Bronze has no rule, so any child value is accepted, and an existing record now holds a combination the map forbids. Used In does not list dependency maps.", note: "Set fields work as parent and as child before a replace (allowed combinations saved, wrong ones refused).", img: "B7-replace-does-not-update-field-dependency-vs-zoho.png" },
  { id: 'B8', sev: 'Low', title: "Removing a value used by an inactive blueprint leaves the blueprint broken", rows: "J6, J6b",
    steps: ["Create a blueprint (inactive) whose states are set values.","Remove one of those values to Unused.","Switch the blueprint on."], exp: "A warning, or the removal is refused, as it is for an active blueprint.",
    act: "The removal is allowed with no warning; switching the blueprint on then fails: \"State 'Done' is not an allowed value of picklist\". Replace on an inactive blueprint does update its states (good). For an active blueprint both Replace and Remove are refused with clear messages.", note: "Zoho blueprint behaviour not checked live (docs: blueprint values cannot be replaced or deleted).", img: null },
];
const ANN = f => path.join(RUN, 'evidence', 'annotated', f), RAW = f => path.join(RUN, 'evidence', 'raw', f), ZO = f => path.join(RUN, 'evidence', 'zoho', f);
const bugHtml = bugs.map(b => `<article class="bug" id="${b.id}"><header><span class="bid">${b.id}</span><span class="sev sev-${b.sev.toLowerCase()}">${b.sev}</span><h3>${esc(b.title)}</h3></header>
<div class="bugbody"><div><h4>Steps</h4><ol>${b.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol><h4>Expected</h4><p>${esc(b.exp)}</p><h4>Actual</h4><p>${esc(b.act)}</p>${b.note ? `<p class="muted">${esc(b.note)}</p>` : ''}<p class="muted">Spec rows: ${esc(b.rows)}</p></div>
${b.img ? `<figure><a href="#full-${b.id}"><img loading="lazy" src="${png(ANN(b.img))}" alt="${b.id} TAVI vs Zoho"></a><figcaption>TAVI left, Zoho right · click to enlarge</figcaption></figure>` : b.raw ? `<figure><img loading="lazy" src="${png(RAW(b.raw))}" alt="${b.id} screenshot"><figcaption>TAVI screenshot (Arabic UI)</figcaption></figure>` : '<div></div>'}</div></article>`).join('');
const lightboxes = bugs.filter(b => b.img).map(b => `<div class="lightbox" id="full-${b.id}"><a class="close" href="#${b.id}">Close</a><img loading="lazy" src="${png(ANN(b.img))}" alt="${b.id} full size"></div>`).join('');

const gallery = (items, dir) => `<div class="gallery">${items.map(([f, cap]) => fs.existsSync(dir(f)) ? `<figure><img loading="lazy" src="${png(dir(f))}" alt="${esc(cap)}"><figcaption>${esc(cap)}</figcaption></figure>` : '').join('')}</div>`;
const zohoShots = [['gs-list.png', 'Global Sets list: Name, Used In (modules), Created By, Modified By; Source, Industry, Countries and States List ship with Zoho'],
  ['gs-usedin.png', 'Associated places of a set: module › field – layout'], ['gs-countries.png', 'Countries and States List feeds address fields; Address Update Preference, Configure'],
  ['gs-edit.png', 'Edit Global Set: name, description, values, Sort order preference, Enable color'], ['gs-edit-gear.png', 'Values menu: View/Add Unused Values, Add Predefined Choices, Add Bulk Options'],
  ['gs-create-gear.png', 'Create Global Set: per-value add / remove / replace buttons'], ['gs-replace-dialog.png', 'Replace Values dialog and its note'],
  ['gs-replace-filled.png', 'Replace Silver Plus → Gold (it ran; records, view criteria and field update changed)'], ['zoho-newpick-gs.png', 'New Pick List: Pick List Type Local / Global Set (not saved)']];
const taviShots = [['B1-list.png', 'Global Sets list (B1–B3 rows)'], ['D-editor.png', 'Edit Global Set: colours, bulk add, Sort A–Z, Replace panel, Unused values'], ['J2-usedin.png', 'Used In dialog with the "reports not listed yet" note'],
  ['E2-record.png', 'Lead stored as Silver shows the renamed label "Silver Plus"'], ['K1-form.png', 'Lead edit form offers used values only'], ['I1-picked.png', 'Layout editor: Advanced › Global set'],
  ['I1-saved2.png', 'Layout save error for a new field from a set (B1)'], ['G2-ui-replace-blocked.png', 'Replace refused because a view uses the value (B3)'], ['C2-filled.png', 'New Global Set from the screen with bulk add and colours'],
  ['K2-field.png', 'Leads list filter on the set field: unused value not offered'], ['L4-ar-editor.png', 'Arabic UI: two labels in English (B5)'], ['L7-big.png', 'Editor with a 990-value set'], ['I1-editor.png', 'Layout editor: address Country is free text (Z6)']];

const plan = [
  ['Ask first', 'Feature, app, reference and output confirmed: Global Sets in CRM, compared with Zoho CRM. Output: plan, missing list, spec, a Plane ticket drafted but not published, then run the spec and report bugs.'],
  ['PRD and earlier tickets', 'NDC-2806 "CRM Global Sets" (Urgent, 8 scope items). Retest round 15 (10 Nov) found it partial; its Zoho comparison was blocked by an expired trial.'],
  ['Map the TAVI build', 'App code: /global-sets API client and globalSets screens. Live API read as owner. Screens checked in the browser.'],
  ['Research Zoho', 'Docs inventory by a research agent (limits, API, editions). Live checks in the Zoho test org org944965048; the user allowed read and write there. QA data created, observed and deleted.'],
  ['Missing list', '11 gaps in 4 groups, each with the Zoho behaviour and the PRD position.'],
  ['Plane draft', 'Gap ticket written in the approved house style; kept as a local file, not published.'],
  ['Spec', 'Groups A–L, 4 E2E journeys, Z1–Z11, traceability to NDC-2806 S1–S8.'],
  ['Run', 'Round 1 and round 2 on NDC-Staging with QA GS1111 data, owner + CRM User account; failed cases compared live with Zoho; everything cleaned up.'],
];

const nav = [['overview', 'Overview'], ['method', 'How it was done'], ['zoho', 'Zoho CRM behaviour'], ['missing', 'Missing list'], ['plane', 'Plane draft'], ['bugs', 'Bugs'], ['results', 'Spec and results'], ['gaps-z', 'Group Z'], ['trace', 'Traceability'], ['setup', 'Spec set-up'], ['evidence', 'TAVI screenshots'], ['cleanup', 'Cleanup and ledgers'], ['files', 'Files']];

const html = `<title>CRM Global Sets Full Report</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: sticky section nav on the left (top bar on phones), one reading column; QA-report look shared with the summary report */
:root{--bg:#f6f7f9;--surface:#fff;--ink:#18202b;--muted:#5b6574;--line:#dfe3ea;--accent:#1f5fbf;--soft:#eef3fb;
--pass:#1d7a46;--fail:#c2352b;--gap:#b36b00;--info:#3b6fb6;--blocked:#6b7280;--notrun:#8a93a3;--inc:#7c4dbb;
--pass-bg:#e5f4ea;--fail-bg:#fbe7e5;--gap-bg:#fbf0dc;--info-bg:#e6eef9;--blocked-bg:#eceef1;--notrun-bg:#f0f1f4;--inc-bg:#f1eafa;
--sans:"IBM Plex Sans",system-ui,-apple-system,"Segoe UI",sans-serif;--mono:"IBM Plex Mono",ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11151b;--surface:#181e26;--ink:#e4e8ee;--muted:#9aa4b2;--line:#2a323d;--accent:#6ea2ef;--soft:#1b2433;
--pass:#5cc78a;--fail:#f07a70;--gap:#e8a945;--info:#7fa8e6;--blocked:#9aa1ad;--notrun:#7d8695;--inc:#b292e6;
--pass-bg:#173225;--fail-bg:#3a1d1b;--gap-bg:#3a2a12;--info-bg:#1b2a40;--blocked-bg:#23282f;--notrun-bg:#20252c;--inc-bg:#2a2140;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#11151b;--surface:#181e26;--ink:#e4e8ee;--muted:#9aa4b2;--line:#2a323d;--accent:#6ea2ef;--soft:#1b2433;
--pass:#5cc78a;--fail:#f07a70;--gap:#e8a945;--info:#7fa8e6;--blocked:#9aa1ad;--notrun:#7d8695;--inc:#b292e6;
--pass-bg:#173225;--fail-bg:#3a1d1b;--gap-bg:#3a2a12;--info-bg:#1b2a40;--blocked-bg:#23282f;--notrun-bg:#20252c;--inc-bg:#2a2140;color-scheme:dark}
body{background:var(--bg);color:var(--ink);font:15px/1.6 var(--sans);padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.shell{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:210px minmax(0,1fr);gap:32px;padding-block:28px 64px}
nav.toc{position:sticky;top:calc(16px + env(safe-area-inset-top,0px));align-self:start;display:flex;flex-direction:column;gap:2px;font-size:14px}
nav.toc .t{font:600 12px var(--mono);color:var(--muted);letter-spacing:.06em;margin-bottom:6px}
nav.toc a{color:var(--muted);text-decoration:none;padding:4px 10px;border-radius:6px;border-left:2px solid transparent}
nav.toc a:hover{color:var(--ink);background:var(--soft)}
main{display:flex;flex-direction:column;gap:44px;min-width:0}
section{display:flex;flex-direction:column;gap:14px;min-width:0;scroll-margin-top:16px}
h1,h2,h3,h4{text-wrap:balance;line-height:1.25;margin:0}
h1{font-size:30px;font-weight:700} h2{font-size:21px;font-weight:600;padding-bottom:8px;border-bottom:1px solid var(--line)}
h3{font-size:16px;font-weight:600} h4{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:12px 0 4px}
.prose h2{font-size:17px;border:0;padding:0;margin-top:18px} .prose h3{font-size:15px;margin-top:14px} .prose h4,.prose h5,.prose h6{font-size:13px;margin-top:12px}
.prose{display:flex;flex-direction:column;gap:10px;max-width:none}
.prose p,.prose li{max-width:80ch} .prose ul,.prose ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:4px}
p{margin:0} .muted{color:var(--muted);font-size:13px} code{font:13px var(--mono);background:var(--soft);padding:1px 5px;border-radius:4px;overflow-wrap:anywhere}
a{color:var(--accent)} hr{border:0;border-top:1px solid var(--line);margin:6px 0}
.eyebrow{font:500 12px var(--mono);color:var(--accent);letter-spacing:.04em}
.meta{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--muted);font-size:13px} .meta b{color:var(--ink);font-weight:500}
.card{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:16px 18px;display:flex;flex-direction:column;gap:10px;min-width:0}
.bar{display:flex;height:12px;border-radius:6px;overflow:hidden;gap:2px} .seg{display:block}
.v-pass{--c:var(--pass);--cb:var(--pass-bg)} .v-fail{--c:var(--fail);--cb:var(--fail-bg)} .v-gap{--c:var(--gap);--cb:var(--gap-bg)} .v-info{--c:var(--info);--cb:var(--info-bg)}
.v-blocked{--c:var(--blocked);--cb:var(--blocked-bg)} .v-notrun{--c:var(--notrun);--cb:var(--notrun-bg)} .v-inconclusive{--c:var(--inc);--cb:var(--inc-bg)}
.seg,.dot{background:var(--c)} .pill{background:var(--cb);color:var(--c);font:600 11px var(--sans);text-transform:uppercase;letter-spacing:.04em;padding:2px 8px;border-radius:4px;white-space:nowrap}
.dot{width:9px;height:9px;border-radius:50%;display:inline-block}
.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chip{font:13px var(--sans);color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:999px;padding:4px 12px;display:inline-flex;align-items:center;gap:6px;cursor:pointer}
.chip b{font-variant-numeric:tabular-nums} .chip[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.chip:focus-visible,a:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.keys{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.key{border-left:3px solid var(--line);padding:2px 0 2px 12px} .key strong{display:block} .k-fail{border-color:var(--fail)} .k-gap{border-color:var(--gap)} .k-pass{border-color:var(--pass)} .k-info{border-color:var(--info)}
.steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;counter-reset:s;padding:0;margin:0;list-style:none}
.steps li{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px 14px;counter-increment:s;display:flex;flex-direction:column;gap:4px}
.steps li::before{content:"Step " counter(s);font:500 12px var(--mono);color:var(--accent)}
.tw{overflow-x:auto;border:1px solid var(--line);border-radius:8px;background:var(--surface)}
table{border-collapse:collapse;width:100%;font-size:14px}
table.res{min-width:980px} table.md{min-width:560px}
th{font:600 12px var(--sans);text-transform:uppercase;letter-spacing:.05em;color:var(--muted);text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);background:var(--surface)}
td{padding:8px 12px;border-top:1px solid var(--line);vertical-align:top} td.id{font:500 13px var(--mono);white-space:nowrap} td.tags{font:12px var(--mono);color:var(--muted)}
td.fact{overflow-wrap:anywhere;min-width:260px} tr.sub td{background:var(--soft)}
.grp{display:flex;flex-direction:column;gap:8px} .grp h3{scroll-margin-top:16px}
.tools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;position:sticky;top:env(safe-area-inset-top,0px);background:var(--bg);padding-block:8px;z-index:2}
.tools input{font:14px var(--sans);color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:7px 10px;flex:1 1 220px;max-width:340px;min-width:0}
.bug{background:var(--surface);border:1px solid var(--line);border-radius:8px;overflow:hidden}
.bug header{display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid var(--line);flex-wrap:wrap}
.bid{font:600 13px var(--mono);color:var(--muted)} .sev{font:600 11px var(--sans);text-transform:uppercase;letter-spacing:.06em;padding:2px 8px;border-radius:4px}
.sev-high{background:var(--fail-bg);color:var(--fail)} .sev-medium{background:var(--gap-bg);color:var(--gap)} .sev-low{background:var(--info-bg);color:var(--info)}
.bugbody{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:20px;padding:4px 18px 18px} .bugbody ol{margin:0;padding-left:20px}
figure{margin:12px 0 0;display:flex;flex-direction:column;gap:6px;min-width:0}
figure img{display:block;width:100%;height:auto;border:1px solid var(--line);border-radius:6px;background:#fff}
figcaption{font-size:12px;color:var(--muted);overflow-wrap:anywhere}
.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
.gallery figure{margin:0;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px}
.ticket{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:18px 22px;display:flex;flex-direction:column;gap:10px}
.ticket ul,.ticket ol{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:4px} .ticket li p{margin:0}
.ticket .ttl{font:600 17px var(--sans)} .draft{font:600 11px var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--gap);background:var(--gap-bg);padding:2px 8px;border-radius:4px;align-self:flex-start}
details{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:12px 16px}
details>summary{cursor:pointer;font-weight:600} details[open]>summary{margin-bottom:10px}
pre{font:12.5px/1.55 var(--mono);background:var(--soft);border-radius:6px;padding:12px;overflow-x:auto;margin:0;white-space:pre}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.lightbox{position:fixed;inset:0;background:rgba(10,14,20,.88);display:none;align-items:flex-start;justify-content:center;overflow:auto;z-index:20;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) 16px max(16px,env(safe-area-inset-left,0px))}
.lightbox:target{display:flex} .lightbox img{max-width:1600px;width:100%;height:auto;border-radius:6px;background:#fff}
.lightbox .close{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:calc(16px + env(safe-area-inset-right,0px));color:#fff;background:rgba(0,0,0,.55);padding:6px 12px;border-radius:6px;text-decoration:none;font-weight:600}
@media (max-width:900px){.shell{grid-template-columns:minmax(0,1fr)} nav.toc{position:static;flex-direction:row;flex-wrap:wrap;gap:4px} nav.toc .t{width:100%} .bugbody{grid-template-columns:minmax(0,1fr)}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}} html{scroll-behavior:smooth}
</style>
<div class="shell">
<nav class="toc" aria-label="Sections"><span class="t">CONTENTS</span>${nav.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
<main>
<section id="overview">
  <span class="eyebrow">FULL QA REPORT · NDC-2806 · 11 NOV 2026</span>
  <h1>CRM Global Sets: TAVI vs Zoho CRM</h1>
  <p style="max-width:78ch">Everything from the Global Sets work: how it was done, how Zoho CRM behaves, what TAVI is missing, the Plane ticket draft, the full spec with every result, the bugs with evidence, screenshots, and the cleanup record. Nothing has been published to Plane.</p>
  <div class="meta"><span><b>TAVI</b> staging-crm.taviportal.com · tenant NDC-Staging · owner + "Mahmoud Samy" (CRM User)</span><span><b>Zoho</b> CRM test org org944965048 (Enterprise trial to 17 Nov 2026)</span><span><b>PRD</b> NDC-2806</span><span><b>Test data prefix</b> QA GS1111</span></div>
  <div class="card"><div class="bar" role="img" aria-label="Results by verdict">${bar}</div><div class="chips">${chips}<span class="muted">${total} rows (spec rows + extra checks) · click a verdict to filter the results</span></div></div>
  <div class="keys">
    <div class="key k-fail"><strong>8 bugs</strong><span class="muted">4 High, 1 Medium, 3 Low</span></div>
    <div class="key k-gap"><strong>11 missing features</strong><span class="muted">vs Zoho CRM; 5 confirmed by the run</span></div>
    <div class="key k-pass"><strong>${count.Pass || 0} rows pass</strong><span class="muted">create, edit, rename, unused values, clone, convert, associate, delete, import, mass update, permissions, audit, speed</span></div>
    <div class="key k-info"><strong>3 rounds</strong><span class="muted">round 1 full run; round 2 leftover rows; round 3 the untested areas with Zoho live checks; data cleaned after each</span></div>
  </div>
</section>

<section id="method"><h2>How it was done</h2><ol class="steps">${plan.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('')}</ol>
<div class="card"><h3>Decisions made by the user</h3><ul class="prose" style="padding-left:20px;margin:0"><li>Compare against Zoho CRM and include every place Zoho uses global sets.</li><li>Draft the Plane ticket but don't publish it.</li><li>Use the Zoho test org org944965048 with read and write (not NDC's real Zoho).</li><li>Run every spec row, including the active workflow check (K5) and the 31-set limit check (C15).</li></ul></div></section>

<section id="zoho"><h2>Zoho CRM behaviour</h2>
<div class="card prose">${md(zLive.replace(/^# .*\n/, ''), { shift: 1 })}</div>
<h3>Zoho screenshots</h3>${gallery(zohoShots, ZO)}
<details><summary>Zoho documentation inventory (sources, limits, API) — ${zDocs.split('\n').length} lines</summary><div class="prose">${md(zDocs.replace(/^# .*\n/, ''), { shift: 1 })}</div></details>
</section>

<section id="missing"><h2>Missing list and what TAVI ships</h2><div class="card prose">${md(missing.replace(/^# .*\n/, ''), { shift: 1 })}</div></section>

<section id="plane"><h2>Plane ticket draft</h2><p class="muted">Kept as docs/crm-global-sets/plane-draft/description.html. Not published.</p>
<div class="ticket"><span class="draft">Draft · not published</span><span class="ttl">Global Sets: features Zoho CRM has that CRM is missing</span>${plane}</div></section>

<section id="bugs"><h2>Bugs</h2><p class="muted">Filed in Plane: B1–B5 = NDC-2865…NDC-2869, B6 = NDC-2917, B7 = NDC-2918, B8 = NDC-2919; gap ticket NDC-2870. Multi-select fields using a set are kept as a TAVI extra (NDC-2923 removed).</p>${bugHtml}</section>

<section id="results"><h2>Spec and results</h2>
<p class="muted">Each spec row with its steps, expected result, verdict and what actually happened. Shaded rows are extra checks run under a spec row.</p>
<div class="tools"><label for="q" class="muted">Search</label><input id="q" type="search" placeholder="Row id or text, e.g. G2 or replace"><span class="chips">${chips}</span><span class="muted" id="shown"></span></div>
${groupTables}${leftoverHtml}
</section>

<section id="gaps-z"><h2>Group Z: gaps (expected = Zoho)</h2><div class="tw"><table class="res"><thead><tr><th>Row</th><th>Gap</th><th>How to check</th><th>Expected</th><th>Verdict</th><th>What we found</th></tr></thead><tbody>${zRows}</tbody></table></div></section>

<section id="trace"><h2>Traceability to NDC-2806</h2><div class="prose">${md(trace.body.join('\n'))}</div></section>

<section id="setup"><h2>Spec set-up: how to run, preconditions, API contract</h2>
<details open><summary>Spec header</summary><div class="prose">${md(front.replace(/^# .*\n/, ''))}</div></details>
${setupSecs.map(s => `<details><summary>${esc(s.title)}</summary><div class="prose">${md(s.body.join('\n'), { shift: 1 })}</div></details>`).join('')}
<details><summary>${esc(reporting.title)}</summary><div class="prose">${md(reporting.body.join('\n'))}</div></details>
</section>

<section id="evidence"><h2>TAVI screenshots</h2>${gallery(taviShots, RAW)}</section>

<section id="cleanup"><h2>Cleanup and ledgers</h2>
<div class="two">
<div class="card"><h3>TAVI NDC-Staging</h3><ul class="prose" style="padding-left:20px;margin:0"><li>All QA GS1111 sets, fields, records, the custom view and the workflow rule deleted after each round.</li><li>Baseline diff: no sets or fields added or removed. Leads Standard layout at version 5 with the same fields as before (a QA field sat on it for a few minutes in round 2).</li><li>Deleted QA records and fields are still in the Recycle Bin: the purge was refused by the permission check.</li><li>Leads "first_name" and "phone" were changed by the owner account at 10:04 and 10:08 UTC; this run's calls don't touch them (likely another session).</li><li>The owner account's language was switched to Arabic for the L4 check and back to English.</li><li>Round 3: the CRM "User" profile got crm:global_set:view for the read-only test and lost it again (permissions match the saved copy). QA reports, dependency maps, a QA blueprint (switched on for one QA-only test, then off), 22 fields and 4 sets were created and deleted.</li><li>QA RT15 data belongs to round 15 and was left alone.</li></ul></div>
<div class="card"><h3>Zoho test org</h3><ul class="prose" style="padding-left:20px;margin:0"><li>Workflow rule, field update, custom view, records, fields and both QA sets deleted.</li><li>Deleting the Tier set turned its last linked field into a local pick list that kept its values (seen, then the field was deleted).</li><li>Deleted records sit in Zoho's Recycle Bin. The "QA RT15 GS Colors" set belongs to round 15.</li><li>Unsaved: a new Pick List field opened in the layout editor was discarded.</li><li>Round 3: a QA report (deleted, then purged from Recently Deleted), a map dependency, 2 fields, 3 leads and a set were created and deleted.</li></ul></div>
</div>
<details><summary>Baseline diff after cleanup (after/diff.json)</summary><pre>${esc(diff)}</pre></details>
<details><summary>TAVI ledger (${ledger.split('\n').length} lines)</summary><pre>${esc(ledger)}</pre></details>
<details><summary>Zoho ledger</summary><pre>${esc(ledgerZ)}</pre></details>
</section>

<section id="files"><h2>Files</h2><div class="tw"><table class="md"><thead><tr><th>What</th><th>Path in the QA repository</th></tr></thead><tbody>
${[['Missing list', 'docs/crm-global-sets/crm-global-sets-missing-list.md'], ['Spec', 'docs/crm-global-sets/spec-crm-global-sets.md'], ['Plane draft', 'docs/crm-global-sets/plane-draft/description.html'], ['Zoho live findings', 'docs/crm-global-sets/reference/zoho-live-findings.md'], ['Zoho docs inventory', 'docs/crm-global-sets/reference/zoho-docs-inventory.md'], ['Run report (text)', 'executions/execu_2026-11-11_crm-global-sets/report.md'], ['Results', 'executions/execu_2026-11-11_crm-global-sets/results.tsv'], ['Ledgers', 'executions/execu_2026-11-11_crm-global-sets/ledger.md, ledger-zoho.md'], ['Bug images', 'executions/execu_2026-11-11_crm-global-sets/evidence/annotated/'], ['Scripts', 'executions/execu_2026-11-11_crm-global-sets/scripts/ (run.sh, common.js, s*.js, make-report.js, make-full-report.js)']].map(([a, b]) => `<tr><td>${a}</td><td><code>${b}</code></td></tr>`).join('')}
</tbody></table></div></section>
</main></div>
${lightboxes}
<script>
(function(){var chips=[].slice.call(document.querySelectorAll('.chip')),q=document.getElementById('q'),rows=[].slice.call(document.querySelectorAll('#results tbody tr')),shown=document.getElementById('shown'),active=null;
function apply(){var t=(q.value||'').toLowerCase(),n=0;rows.forEach(function(r){var ok=(!active||r.getAttribute('data-v')===active)&&(!t||r.textContent.toLowerCase().indexOf(t)>-1);r.hidden=!ok;if(ok)n++;});shown.textContent=n+' of '+rows.length+' rows';
[].slice.call(document.querySelectorAll('#results .grp')).forEach(function(g){g.hidden=![].slice.call(g.querySelectorAll('tbody tr')).some(function(r){return !r.hidden;});});}
chips.forEach(function(c){c.addEventListener('click',function(){var f=c.getAttribute('data-f');active=active===f?null:f;chips.forEach(function(x){x.setAttribute('aria-pressed',String(x.getAttribute('data-f')===active));});apply();if(!c.closest('#results'))document.getElementById('results').scrollIntoView({block:'start'});});});
q.addEventListener('input',apply);apply();})();
</script>`;
fs.writeFileSync(path.join(RUN, 'full-report.html'), html);
console.log('full-report.html', Math.round(html.length / 1024) + ' KB', JSON.stringify(count), 'leftovers', leftovers.join(','), 'notrunSpec', notrunSpec.join(','));
