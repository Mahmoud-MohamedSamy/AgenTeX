// node scripts/build-report.js -> report/validation-rules-report.html (full run report for review)
const fs = require('fs'), path = require('path');
const RUN = path.resolve(__dirname, '..');
const C = require(path.resolve(RUN, '../../docs/validation-rules/cases.js'));
const R = require(RUN + '/out/sheet-results.json');
const img = f => 'data:image/png;base64,' + fs.readFileSync(RUN + '/evidence/' + f).toString('base64');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const byId = Object.fromEntries(C.cases.map(c => [c[0], c]));
const groups = Object.fromEntries(C.groups.map(g => [g[0], g[1]]));
const st = id => (R[id] ? R[id].status : 'none');
const ORDER = ['pass', 'info', 'fail', 'blocked', 'gap', 'none'];
const LABEL = { pass: 'Pass', info: 'Info', fail: 'Fail', blocked: 'Blocked', gap: 'Gap', none: 'Not run' };

// counts
const total = {}; ORDER.forEach(s => total[s] = 0);
const perGroup = {};
for (const c of C.cases) { const s = st(c[0]); total[s]++; perGroup[c[1]] = perGroup[c[1]] || Object.fromEntries(ORDER.map(k => [k, 0])); perGroup[c[1]][s]++; }

const bar = ORDER.filter(s => total[s]).map(s => `<span class="seg s-${s}" style="flex:${total[s]}" title="${LABEL[s]} ${total[s]}"></span>`).join('');
const tiles = ORDER.map(s => `<div class="tile"><span class="dot s-${s}"></span><b>${total[s]}</b><span>${LABEL[s]}</span></div>`).join('');
const groupRows = C.groups.map(([g, name]) => { const p = perGroup[g] || {}; const n = ORDER.reduce((a, s) => a + (p[s] || 0), 0);
  return `<tr><td><span class="gid">${g}</span> ${esc(name)}</td><td class="num">${n}</td>${ORDER.map(s => `<td class="num ${p[s] ? 'c-' + s : 'zero'}">${p[s] || '–'}</td>`).join('')}</tr>`; }).join('');

// bugs
const BUGS = [
  { id: 'I1', sev: 'High', app: 'CRM (editor is shared with Desk)', head: 'Two admins edit the same rule: the second save silently wipes the first',
    actual: 'Tab A and tab B open the same rule. B saves "changed in tab 2". A, still showing the old copy, saves "changed in tab 1". A\'s save is accepted with no message and B\'s change is gone. The server already knows how to refuse this (an old version returns 409 "This validation rule was changed by someone else"), but the editor does not send the version, so the check never runs.',
    expected: 'The second save is refused with "changed by someone else, reload", like the API does when it gets the version.', imgs: ['crm-I1-conflict.png'] },
  { id: 'J7', sev: 'Medium', app: 'Desk', head: 'Old Desk rule shows the wrong warning and is still enforced',
    actual: 'The existing rule "QA NDC Reject needs a reason" (no layout) is marked in the list and the editor as "This rule can\'t be applied (a field it uses changed or was deleted)". The real cause is the missing layout (the editor opens with Layout empty). The warning also says the rule can\'t be applied, but the server still applies it: a ticket set to "QA NDC Reject" with no reason is refused with "Please add a clear rejection reason".',
    expected: 'The warning names the real cause (no layout) and matches what the server does: either the rule runs and no warning says it can\'t, or it really stops running.', imgs: ['desk-B8-list.png', 'desk-J7-editor.png'] },
  { id: 'J2', sev: 'Medium', app: 'CRM + Desk', head: 'A field used in a rule\'s "Applies when" can be deleted, leaving the rule broken but Active',
    actual: 'Deleting the field that a rule uses only in "Applies when" is accepted (204) with no warning. The rule stays Active with the hidden error "\'qa_vr_j2\' is not a field of this module" and stops doing its job; records save freely. The field the rule checks is protected (FIELD_IN_USE_BY_RULE), so only this part is missing.',
    expected: 'The delete is refused (or warns) the same way it does for the checked field, or the rule is switched off and flagged.', imgs: [] },
  { id: 'G14', sev: 'High', app: 'CRM', head: 'A value typed into a blueprint transition form skips validation rules', run: '13 Nov',
    actual: 'QA blueprint on the test layout: the transition "QA to Reject" asks for the text field. An active rule refuses text starting with BAD. On the lead page the user clicks "QA to Reject", types BAD-bp and clicks Execute. The transition succeeds (200) and the lead now holds BAD-bp. No check runs in the form or on the server. The after-transition field update also writes past a rule, which matches Zoho.',
    expected: 'The transition is refused with the rule message, the same as a normal save.', imgs: ['crm-G14-bad.png'] },
  { id: 'G18', sev: 'High', app: 'Desk', head: 'A value typed into a ticket blueprint step skips validation rules', run: '13 Nov',
    actual: 'Same QA blueprint on a Desk ticket. The agent clicks "QA to Reject", types BAD-bp and clicks Run. No field check runs, the transition succeeds (200) and the ticket moves to Reject with BAD-bp saved.',
    expected: 'The step is refused with the rule message and the ticket stays in Open.', imgs: ['desk-G18-typed.png', 'desk-G18-after.png'] },
  { id: 'J6', sev: 'Medium', app: 'CRM + Desk', head: 'Deleting a layout leaves its rules listed and Active',
    actual: 'A layout that has an active rule can be deleted (204). The rule stays in the list and stays Active, pointing to a layout that no longer exists (hidden error "Layout … is not a layout of this module").',
    expected: 'The layout delete warns about the rules, and the rules are removed or switched off and clearly flagged.', imgs: [] },
  { id: 'H6', sev: 'High', app: 'CRM + Desk (Desk checked with a Desk Agent)', head: 'A user is blocked by a rule on a field they are not allowed to change', run: '13 Nov',
    actual: 'Rule "note must not be empty". The note field is set to read-only for the profile User. A CRM User creates a lead: they cannot type in the note, and the save is refused with "QA H6 note is required". The user has no way to save. The owner is still blocked, which is correct.',
    expected: 'The rule does not block a user on a field they cannot change. Zoho CRM skips a rule when the field is read-only for the profile.', imgs: [] },
  { id: 'H7', sev: 'High', app: 'CRM + Desk', head: 'A user is blocked by a rule on a field that is hidden from them', run: '13 Nov',
    actual: 'Same rule, with the note field hidden for the profile User (the effective permissions say hidden). The CRM User saves and is refused with "QA H6 note is required" for a field they cannot even see.',
    expected: 'The rule does not run for users who cannot see the field; it still runs for everyone else.', imgs: [] },
  { id: 'C7', sev: 'Medium', app: 'Desk', head: 'Deleted department shows as a raw id and the rule gives no warning', run: '13 Nov',
    actual: 'A rule for "QA VR1112 C7 dept" + Customer Support. The department is then deleted. The rule stays Active with no warning. The rules list shows "d2a27f92-6a33-… , Customer Support" instead of "(deleted department)". The editor shows only Customer Support ticked and gives no sign of the deleted one; Save keeps the deleted id.',
    expected: 'The list and editor show "(deleted department)"; the rule still loads and saves.', imgs: ['desk-N3-list.png', 'desk-C7-editor.png'] },
  { id: 'M4', sev: 'Medium', app: 'CRM + Desk', head: 'Screen readers are not told why a save was refused', run: '13 Nov',
    actual: 'When a save is refused, the message appears under the field, but the input has no aria-invalid, no aria-describedby pointing at the message, and there is no role="alert" or live region. On CRM focus moves to the bad field; on Desk focus goes to Subject instead.',
    expected: 'The field is marked invalid, the message is linked to it and announced, and focus goes to the refused field.', imgs: ['crm-M4-refused.png', 'desk-M4-refused.png'] },
  { id: 'E2', sev: 'Medium', app: 'CRM', head: 'A message set to show "at the top of the form" is not brought into view',
    actual: 'With "Show the error: at the top of the form", the message is drawn at the top, but Save does not scroll to it and the field is not marked. A user who is lower down the form presses Save and sees nothing happen.',
    expected: 'The page scrolls to the message (or the field is also marked), so the user sees why the save failed. Zoho shows the alert where the user can see it.', imgs: ['crm-E2-top.png', 'crm-E2-top-scrolled.png', 'zoho-E2-alert.png'] },
  { id: 'B2', sev: 'Low', app: 'CRM', head: 'Rules list shows the raw layout id instead of the layout name',
    actual: 'On a fresh page load the CRM rules list shows "9f0069ec-a4a0-4f50-…" in the Layout column instead of "QA VR1112 Layout". Seen twice, in English and Arabic. The name appears only after a save in the same page. The Desk list shows names correctly.',
    expected: 'The Layout column always shows the layout name.', imgs: ['crm-B2-list.png'] },
  { id: 'K3', sev: 'Low', app: 'CRM + Desk', head: 'Deleting a rule through another module\'s address says "deleted" but deletes nothing',
    actual: 'DELETE /modules/{other module}/validation-rules/{id} answers 204. The rule is still there afterwards (GET on the right module 200). GET through the wrong module correctly answers 404.',
    expected: 'The wrong-module DELETE answers 404, the same as GET.', imgs: [] },
];
const bugCards = BUGS.map(b => { const c = byId[b.id];
  return `<article class="bug" id="bug-${b.id}"><header><span class="cid">${b.id}</span><h3>${esc(b.head)}</h3>${b.run ? '<span class="pill s-info">new, 13 Nov</span>' : ''}<span class="sev sev-${b.sev.toLowerCase()}">${b.sev}</span></header>
  <p class="meta">${esc(b.app)} · Case: ${esc(c[3])} · ${esc(groups[c[1]])}</p>
  <dl><dt>Test</dt><dd>${esc(c[4])}</dd><dt>What happened</dt><dd>${esc(b.actual)}</dd><dt>Expected</dt><dd>${esc(b.expected)}</dd></dl>
  ${b.imgs.length ? `<div class="shots">${b.imgs.map(f => `<figure><img loading="lazy" src="${img(f)}" alt="${esc(f)}"><figcaption>${esc(f)}</figcaption></figure>`).join('')}</div>` : '<p class="note">API check, no screenshot. Full response text is in the case notes below.</p>'}
  </article>`; }).join('\n');

// discuss
const DISCUSS = [
  ['F10', 'Possible security risk', 'Function rule URLs that point inside the network are accepted at save: https://localhost, 127.0.0.1, 169.254.169.254 (cloud metadata), 10.0.0.5 and [::1] all returned 201. I could not prove the server then calls them (no receiver). Ask the developers whether calls to private addresses are refused.'],
  ['G13', 'Workflow updates skip rules', 'A workflow field update on create wrote qa_vr_text = "BAD-from-workflow" and the record saved, although the rule refuses that value. Zoho also lets workflow field updates through, so this may be by design; decide if TAVI should match.'],
  ['J3', 'Rule silently stops working', 'Removing the checked field from the rule\'s layout is allowed and the rule stays Active with no warning. It now has nothing to check on that layout.'],
  ['J4', 'Pick-list value removed', 'Removing the pick-list value "No" that an active rule compares to is allowed. The rule stays Active with the hidden error "\'No\' is not one of the options". Same family as J2.'],
  ['C15', 'Conditions reset with no prompt', 'Changing "Field to check" after adding conditions keeps the conditions but switches them to the new field, resets the operator to "is empty" and drops the values, with no prompt. An admin who doesn\'t notice gets a rule that blocks every record with an empty value (this happened during the run in I2).'],
  ['G22', 'Merge skips rules', 'Merging two records (CRM) or tickets (Desk) and keeping the value from the duplicate writes "BAD-dup" into the master, although an active rule refuses it (merge 200 on both apps). Zoho behaviour is not documented.'],
  ['B9', 'Warnings banner never appears', 'The editor has a "saved, with warnings" banner, but the server returned no warnings for every case tried, including a rule on a layout that does not have the field. The banner was never shown.'],
  ['N3', 'Slow rule creation on CRM', 'Creating 60 rules took about 2 seconds each on CRM (128 s), against 0.3 s each on Desk. The list itself stays fast (search 12 ms).'],
  ['F9', 'Function call details', 'Checked with a live webhook.site receiver: the call carries the record values, record id on edit and a correct HMAC-SHA256 signature, and no user token. The layout id is not sent, and the signature has no timestamp, so a captured request could be replayed.'],
  ['X2', 'Warning confirmations not in the audit log', 'The warn flow works, but the audit log records only "record created", not that the user saw and confirmed a warning.'],
  ['C17', 'Duplicate rule names', 'Two rules with the same name are both saved (201) on CRM and Desk. The Zoho rule on names is not documented; decide if TAVI should refuse.'],
];
const discussRows = DISCUSS.map(([id, h, t]) => `<li><span class="cid">${id}</span><div><b>${esc(h)}.</b> ${esc(t)}</div></li>`).join('');

const ZOHO_DIFF = [
  ['D20', 'Several failing conditions', 'TAVI stops at the first condition whose "Applies when" matches; the editor says so. Zoho CRM (checked live) fires every failing condition and shows all alerts.'],
  ['G3', 'Editing an old record that already breaks a new rule', 'TAVI allows a save that changes another field and refuses only when the checked field changes. Zoho CRM (live) refuses the save even when only another field (Title) changes.'],
  ['G13', 'Workflow field update', 'Writes a value that breaks a rule and the record saves (see above).'],
  ['H6 / Z11', 'Field read-only or hidden for the user', 'Zoho CRM skips a rule when the field is read-only for the profile. TAVI still runs it and blocks the user (bugs H6, H7).'],
  ['Z10', 'Removing the checked field from a Desk layout', 'Zoho Desk asks, then switches the rule off. TAVI allows it with no prompt and the rule stays Active (J3).'],
  ['Z13 / D26', 'Relative dates', 'Zoho Desk accepts ${CURRENTTIME} in date rules. TAVI takes only fixed dates (API refuses today / ${CURRENTTIME}). Zoho CRM has no relative dates either.'],
  ['G7', 'Lead convert', 'Same as Zoho: converting a lead runs the rules of the target module (refused with the Contacts rule message).'],
  ['D1', 'Text "is" and case', 'Same as Zoho: "is" ignores upper and lower case.'],
  ['D14', 'Pattern rules and empty fields', 'TAVI "does not match the pattern" fires on an empty optional field, so the admin must add "Applies when … is not empty". Zoho CRM has no pattern check, and its "does not contain" does not fire on an empty field.'],
];
const STRONGER = [
  ['Z9', 'A field a rule checks can\'t be deleted (FIELD_IN_USE_BY_RULE). Zoho deletes the field and the rule with it.'],
  ['Z7', 'API and import saves always run the rules. In Zoho CRM the API runs them only when the caller opts in; a plain API insert with a bad value succeeds (checked live).'],
  ['Z5', 'Mass update runs the rule on every record. Zoho hides fields with rules from mass update (checked live).'],
  ['I5 / I6 / Z14', 'Bigger limits: 25 conditions per rule (Zoho 10) and 1000-character messages (Zoho 100). Names up to 200 characters.'],
  ['Z1–Z4', 'The intake listed lookup, checkbox, owner and Status fields as missing. They are built now: the CRM and Desk editors offer them and the server enforces them.'],
  ['Extras', 'Regex checks in CRM, English + Arabic message per condition, warn-and-let-the-user-decide, "trigger when it does not match", All-layouts rules, a full rules API, a Test button for function rules and a signing secret. These are pluses, not bugs.'],
];

const blockedIds = C.cases.filter(c => st(c[0]) === 'blocked');
const BLOCK_NEED = {
  G15: 'Help Center form needs a CAPTCHA. Manual check needed (steps are in the case notes).', G16: 'Help Center CAPTCHA, as G15.', X4: 'Help Center CAPTCHA, as G15.',
  F6: 'Needs a public HTTPS test receiver for function rules.', F7: 'Needs a public HTTPS test receiver.', F9: 'Needs a public HTTPS test receiver.', X5: 'Needs a public HTTPS test receiver.',
  G6: 'Retried 13 Nov: the Leads Kanban still shows "Could not load these records"; each column\'s records call returns 500. Looks like its own bug.', A3: 'No Desk Agent account on NDC-Staging (all Desk users are administrators).',
  A7: 'Needs a short change to the shared User profile permissions; refused by my safety check, needs your OK or a manual test.', G12: 'Built a QA web form with CAPTCHA off, but the public form API returns 404 for every form on staging (the existing Desk form too). Looks like a regression of NDC-2732.', Z6: 'Depends on G12.', G17: 'TAVI cannot send mail as the owner (no mail account). Needs one email sent from a real mailbox to the Customer Support address; the subject rule is in place.', Z15: 'No TAVI mobile app.' };
const blockedRows = blockedIds.map(c => `<li><span class="cid">${c[0]}</span><div><b>${esc(c[3])}.</b> ${esc(BLOCK_NEED[c[0]] || '')}</div></li>`).join('');
const notRun = C.cases.filter(c => st(c[0]) === 'none');
const notRunRows = notRun.map(c => `<li><span class="cid">${c[0]}</span><span>${esc(c[3])}</span><span class="pri">${esc(c[6])}</span></li>`).join('');
const rRows = C.cases.filter(c => c[1] === 'R').map(c => `<li><span class="cid">${c[0]}</span><div><b>${esc(c[3])}</b> <span class="pill s-${st(c[0])}">${LABEL[st(c[0])]}</span><br><span class="small">${esc((R[c[0]] || {}).notes || '').slice(0, 300)}</span></div></li>`).join('');

const DATA = C.cases.map(c => ({ id: c[0], g: c[1], app: c[2], t: c[3], steps: c[4], exp: c[5], pri: c[6], via: c[7], s: st(c[0]), n: (R[c[0]] || {}).notes || '' }));

const html = `<title>Validation Rules Test Run</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Sora:wght@600;700&display=swap" rel="stylesheet">
<style>
/* Layout: one reading column; summary first, then findings by weight, then the full filterable case list */
:root{--bg:#f6f7f9;--panel:#fff;--fg:#1b2230;--mute:#5d6778;--line:#dfe3ea;--accent:#2f5bd3;
--pass:#1f8a4c;--info:#4f6d9a;--fail:#c8372d;--blocked:#c27a0e;--gap:#7b4cc2;--none:#9aa3b2;
--passbg:#e5f4ec;--infobg:#e9eef6;--failbg:#fbe9e7;--blockedbg:#fbf0dc;--gapbg:#f0e9fa;--nonebg:#eef0f3;
--display:'Sora',system-ui,sans-serif;--body:'IBM Plex Sans',system-ui,sans-serif;--mono:'IBM Plex Mono',ui-monospace,Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#11151c;--panel:#181e28;--fg:#e4e8ef;--mute:#9aa4b5;--line:#2b3442;--accent:#7f9ff0;
--pass:#4cc282;--info:#8fa9d4;--fail:#f07a6f;--blocked:#e6a64a;--gap:#b28be8;--none:#78808e;
--passbg:#16301f;--infobg:#1d2636;--failbg:#3a1d1a;--blockedbg:#36280f;--gapbg:#2a1f3b;--nonebg:#222833;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#11151c;--panel:#181e28;--fg:#e4e8ef;--mute:#9aa4b5;--line:#2b3442;--accent:#7f9ff0;
--pass:#4cc282;--info:#8fa9d4;--fail:#f07a6f;--blocked:#e6a64a;--gap:#b28be8;--none:#78808e;
--passbg:#16301f;--infobg:#1d2636;--failbg:#3a1d1a;--blockedbg:#36280f;--gapbg:#2a1f3b;--nonebg:#222833;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font:15px/1.55 var(--body)}
.wrap{max-width:1080px;margin:0 auto;padding-block:32px 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:36px}
h1,h2,h3{font-family:var(--display);text-wrap:balance;margin:0}
h1{font-size:30px;line-height:1.2}h2{font-size:21px;margin-bottom:12px}h3{font-size:16px;font-family:var(--body);font-weight:600}
p{margin:0}.lead{color:var(--mute);max-width:70ch}.small{font-size:13px;color:var(--mute)}
a{color:var(--accent)}
.eyebrow{font:500 12px var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}
header.top{display:flex;flex-direction:column;gap:10px}
.facts{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13px;color:var(--mute)}.facts b{color:var(--fg);font-weight:500}
.panel{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:20px}
.bar{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;margin:6px 0 14px}
.seg{display:block}.s-pass{background:var(--pass)}.s-info{background:var(--info)}.s-fail{background:var(--fail)}.s-blocked{background:var(--blocked)}.s-gap{background:var(--gap)}.s-none{background:var(--none)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.tile{display:flex;align-items:baseline;gap:8px}.tile b{font:600 26px var(--display);font-variant-numeric:tabular-nums}.tile span:last-child{color:var(--mute);font-size:13px}
.dot{width:10px;height:10px;border-radius:50%;display:inline-block;align-self:center}
.verdict{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:18px}
.verdict div{border-top:2px solid var(--line);padding-top:8px;font-size:14px}.verdict b{display:block;font-size:13px;color:var(--mute);font-weight:500}
.tblwrap{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:14px}th,td{padding:7px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}
th{font:500 12px var(--mono);letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}td.zero{color:var(--line)}
.c-pass{color:var(--pass)}.c-info{color:var(--info)}.c-fail{color:var(--fail);font-weight:600}.c-blocked{color:var(--blocked)}.c-gap{color:var(--gap)}.c-none{color:var(--none)}
.gid,.cid{font:500 12px var(--mono);background:var(--nonebg);border-radius:4px;padding:1px 6px;white-space:nowrap}
.bug{background:var(--panel);border:1px solid var(--line);border-left:4px solid var(--fail);border-radius:10px;padding:18px 20px;display:flex;flex-direction:column;gap:10px}
.bug header{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.bug h3{flex:1;min-width:200px}
.bugs{display:flex;flex-direction:column;gap:14px}
.sev{font:600 12px var(--mono);padding:2px 8px;border-radius:4px}.sev-high{background:var(--failbg);color:var(--fail)}.sev-medium{background:var(--blockedbg);color:var(--blocked)}.sev-low{background:var(--infobg);color:var(--info)}
.meta{font-size:13px;color:var(--mute)}
dl{display:grid;grid-template-columns:120px 1fr;gap:6px 14px;margin:0;font-size:14px}dt{color:var(--mute);font-size:13px}dd{margin:0;min-width:0}
@media (max-width:560px){dl{grid-template-columns:1fr}dt{margin-top:6px}}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
figure{margin:0}figure img{border:1px solid var(--line);border-radius:6px;display:block;cursor:zoom-in}figcaption{font:12px var(--mono);color:var(--mute);margin-top:4px}
.note{font-size:13px;color:var(--mute)}
ul.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
ul.list li{display:flex;gap:12px;align-items:baseline}ul.list li>div{min-width:0}
ul.cols{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:6px 18px;font-size:14px}
ul.cols li{display:flex;gap:10px;align-items:baseline}ul.cols .pri{margin-left:auto;font:12px var(--mono);color:var(--mute)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px}
.pill{font:500 12px var(--mono);padding:1px 8px;border-radius:10px;white-space:nowrap}
.pill.s-pass{background:var(--passbg);color:var(--pass)}.pill.s-info{background:var(--infobg);color:var(--info)}.pill.s-fail{background:var(--failbg);color:var(--fail)}.pill.s-blocked{background:var(--blockedbg);color:var(--blocked)}.pill.s-gap{background:var(--gapbg);color:var(--gap)}.pill.s-none{background:var(--nonebg);color:var(--none)}
.filters{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}
.chip{font:500 13px var(--body);border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:16px;padding:4px 12px;cursor:pointer}
.chip[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
select,input[type=search]{font:14px var(--body);background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:6px;padding:5px 8px}
input[type=search]{flex:1;min-width:180px}
button:focus-visible,select:focus-visible,input:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.cases{display:flex;flex-direction:column;border-top:1px solid var(--line)}
details.case{border-bottom:1px solid var(--line)}
details.case summary{display:grid;grid-template-columns:52px 1fr auto auto;gap:10px;align-items:baseline;padding:9px 4px;cursor:pointer;list-style:none}
details.case summary::-webkit-details-marker{display:none}
details.case summary .t{min-width:0}details.case summary .app{font:12px var(--mono);color:var(--mute)}
details.case .body{padding:4px 4px 14px 66px;display:flex;flex-direction:column;gap:8px;font-size:14px}
@media (max-width:560px){details.case summary{grid-template-columns:44px 1fr auto}details.case summary .app{display:none}details.case .body{padding-left:4px}}
.notes{font:13px/1.5 var(--mono);white-space:pre-wrap;word-break:break-word;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:10px}
.count{font-size:13px;color:var(--mute);margin-left:auto}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) max(16px,env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));z-index:20;cursor:zoom-out}
.lb img{max-height:100%;border-radius:6px}
</style>
<div class="wrap">
<header class="top">
  <span class="eyebrow">Test run report · for review before Plane</span>
  <h1>Validation Rules: TAVI CRM + Desk vs Zoho</h1>
  <p class="lead">Every result from the runs of 12 and 13 November 2026 (all 174 cases). Rules were tested on CRM Leads and Desk Tickets on NDC-Staging, and compared live with the Zoho CRM and Zoho Desk test orgs. Nothing has been filed in Plane.</p>
  <div class="facts"><span>Environment <b>NDC-Staging</b></span><span>Dates <b>12–13 Nov 2026</b></span><span>Cases <b>${C.cases.length}</b></span><span>Run <b>${C.cases.length - total.none}</b></span><span>Lanes <b>API + browser (Chromium), owner and a CRM User</b></span><span>Editable sheet <a href="https://claude.ai/artifact/Dqx4bfePnFaL1DZUu5tS1u" target="_blank" rel="noopener">open</a></span></div>
</header>

<section class="panel" aria-labelledby="sum">
  <h2 id="sum">Summary</h2>
  <div class="bar" role="img" aria-label="Result split">${bar}</div>
  <div class="tiles">${tiles}</div>
  <div class="verdict">
    <div><b>Main point</b>Rules work: they block and warn on create, edit, inline edit, mass update, API and import, in both apps. The old "rules never apply" problem is fixed.</div>
    <div><b>Bugs</b>${BUGS.length} found (6 new on 13 Nov). The serious ones: blueprint steps that skip rules, a user blocked by a rule on a field they can't edit or see, two admins overwriting each other, and rules left Active but broken after a field, layout or department is deleted.</div>
    <div><b>Zoho parity</b>Only one gap left (function code inside the product). Four items from the intake gap list are now built.</div>
    <div><b>Still open</b>Every case has a result now. ${total.blocked} are still blocked: Help Center CAPTCHA, web forms and Kanban broken on staging, no mobile app, and a profile permission change my safety check refuses.</div>
  </div>
</section>

<section aria-labelledby="grp"><h2 id="grp">Results by area</h2>
<div class="panel tblwrap"><table><thead><tr><th>Area</th><th class="num">Cases</th>${ORDER.map(s => `<th class="num">${LABEL[s]}</th>`).join('')}</tr></thead><tbody>${groupRows}</tbody></table></div></section>

<section aria-labelledby="old"><h2 id="old">Older tickets</h2><div class="panel"><ul class="list">${rRows}</ul></div></section>

<section aria-labelledby="bugs"><h2 id="bugs">Bugs found (${BUGS.length})</h2>
<p class="lead" style="margin-bottom:14px">Severity is my suggestion. Click a screenshot to enlarge it.</p>
<div class="bugs">${bugCards}</div></section>

<section aria-labelledby="disc"><h2 id="disc">Worth discussing</h2>
<p class="lead" style="margin-bottom:14px">Marked Info in the sheet. Each could be a bug or a design choice. Your call before anything is filed.</p>
<div class="panel"><ul class="list">${discussRows}</ul></div></section>

<section class="two">
  <div><h2>Different from Zoho</h2><div class="panel"><ul class="list">${ZOHO_DIFF.map(([id, h, t]) => `<li><span class="cid">${id}</span><div><b>${esc(h)}.</b> ${esc(t)}</div></li>`).join('')}</ul></div></div>
  <div><h2>Where TAVI is stronger</h2><div class="panel"><ul class="list">${STRONGER.map(([id, t]) => `<li><span class="cid">${esc(id)}</span><div>${esc(t)}</div></li>`).join('')}</ul></div></div>
</section>

<section aria-labelledby="gap"><h2 id="gap">Gap left vs Zoho (1)</h2>
<div class="panel"><ul class="list"><li><span class="cid">Z8</span><div><b>Function code inside the product.</b> Zoho CRM lets you write the check as a Deluge function inside Zoho. TAVI calls an outside HTTPS address you host. The result is the same, but the customer needs their own server.</div></li></ul></div></section>

<section class="two">
  <div><h2>Blocked (${blockedIds.length})</h2><div class="panel"><ul class="list">${blockedRows}</ul></div></div>
  <div><h2>Cleanup</h2><div class="panel"><ul class="list">
    <li><span class="cid">TAVI</span><div>All QA VR1112 test data from both runs is removed: rules, layout rules, test fields, both test layouts, the Desk contacts, the test department, imported and converted records. Every deleted test record was then purged from the Recycle Bin by exact record id (about 190 items, all named QA VR1112 or created by our own lead convert).</div></li>
    <li><span class="cid">Left</span><div>One test lead "QA VR1112 G14" (id 39145329…) can't be deleted: TAVI says it is "under review" (an approval process picked it up). It needs the review closed, then delete. Profile User permissions were not changed (A7).</div></li>
    <li><span class="cid">NDC</span><div>The existing rule "QA NDC Reject needs a reason" was not changed.</div></li>
    <li><span class="cid">Zoho</span><div>Everything created in the test orgs was deleted. One deleted CRM field may still show in Zoho's deleted-fields list.</div></li>
  </ul></div></div>
</section>

${notRun.length ? `<section aria-labelledby="nr"><h2 id="nr">Not run (${notRun.length})</h2>
<p class="lead" style="margin-bottom:14px">Not reached in this run. They are still open in the sheet, so you can run any of them yourself and record the result there.</p>
<div class="panel"><ul class="cols">${notRunRows}</ul></div></section>` : ''}

<section aria-labelledby="all"><h2 id="all">All ${C.cases.length} cases</h2>
<div class="filters" role="group" aria-label="Filter by result">
  <button class="chip" data-s="all" aria-pressed="true">All</button>
  ${ORDER.map(s => `<button class="chip" data-s="${s}" aria-pressed="false">${LABEL[s]} ${total[s]}</button>`).join('')}
</div>
<div class="filters">
  <label class="small" for="fg">Area</label><select id="fg"><option value="">All areas</option>${C.groups.map(([g, n]) => `<option value="${g}">${g} · ${esc(n)}</option>`).join('')}</select>
  <label class="small" for="fa">App</label><select id="fa"><option value="">Any</option><option>CRM</option><option>Desk</option><option>Both</option></select>
  <input type="search" id="fq" placeholder="Search id, title or notes" aria-label="Search cases">
  <span class="count" id="cnt"></span>
</div>
<div class="cases" id="list"></div></section>
</div>
<script>
const D=${JSON.stringify(DATA).replace(/</g, '\\u003c')};
const G=${JSON.stringify(groups)};const L=${JSON.stringify(LABEL)};
const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let S='all';const list=document.getElementById('list');
function draw(){const g=fg.value,a=fa.value,q=fq.value.trim().toLowerCase();
 const rows=D.filter(c=>(S==='all'||c.s===S)&&(!g||c.g===g)&&(!a||c.app===a)&&(!q||(c.id+' '+c.t+' '+c.n+' '+c.steps).toLowerCase().includes(q)));
 cnt.textContent=rows.length+' shown';
 list.innerHTML=rows.map(c=>'<details class="case"><summary><span class="cid">'+e(c.id)+'</span><span class="t">'+e(c.t)+'</span><span class="app">'+e(c.app)+' · '+e(c.pri)+'</span><span class="pill s-'+c.s+'">'+L[c.s]+'</span></summary><div class="body"><div class="small">'+e(G[c.g])+' · via '+e(c.via)+'</div><div><b>Steps.</b> '+e(c.steps)+'</div><div><b>Expected.</b> '+e(c.exp)+'</div>'+(c.n?'<div class="notes">'+e(c.n)+'</div>':'<div class="small">No result yet.</div>')+'</div></details>').join('');}
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{S=b.dataset.s;document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));draw();});
[fg,fa].forEach(x=>x.onchange=draw);fq.oninput=draw;draw();
document.addEventListener('click',ev=>{const i=ev.target.closest('figure img');if(i){const d=document.createElement('div');d.className='lb';d.innerHTML='<img alt="">';d.firstChild.src=i.src;d.onclick=()=>d.remove();document.body.appendChild(d);}});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape')document.querySelectorAll('.lb').forEach(x=>x.remove());});
</script>`;
fs.mkdirSync(RUN + '/report', { recursive: true });
fs.writeFileSync(RUN + '/report/validation-rules-report.html', html);
console.log('written', (html.length / 1024).toFixed(0) + ' KB', JSON.stringify(total));
