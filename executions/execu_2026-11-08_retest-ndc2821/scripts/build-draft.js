const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');
const P=s=>s+' <strong>[PASS]</strong>',I=s=>s+' <strong>[INFO]</strong>';
const ul=a=>'<ul>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
const checks=[
P('Skill Types tab → Department picker, same as the Skills tab; help text "Skill types group this department\'s skills…"; "Every department uses the same types." gone in English and Arabic (RTL)'),
P('Add "QA RT14 alpha" in QA AS6 Dept A → listed in A, not in B (screen and API), still there after reload'),
P('Same name in Dept B → allowed; second copy in Dept B → "A skill type with this name already exists."; rename to an existing name → 409'),
P('Rename in Dept A → Dept B\'s copy unchanged; renaming a type shows on its skill'),
P('Delete in Dept A → Dept B\'s copy stays; type in use refused: "Skills still have this skill type. Give them another type first."'),
P('Skill form → type picker lists only the department\'s types; "+ New skill type" adds the type to that department only'),
P('Skill using another department\'s type → create and edit refused, 400 type_id not_found; the skill\'s type is unchanged'),
P('Skills tab type filter → only the department\'s types'),
P('Existing data, all 40 departments → General, Tech, QA AS6 Type, QA AS6 Type3 in the old order; 248 skills all have a type of their own department; 217 present in the 6 Nov backup kept their type, none lost'),
P('New department → no types, list empty'),
P('Skill routing → skill added on create, skill round robin assigned A2 (#1375); Recalculate keeps the skill; Assign by Skills assigned A2'),
P('Desk Agent without "Manage assignment rules" → API 403; page "You can\'t manage skills"'),
P('Audit Log → skill type changes logged'),
P('Zoho (org techsolutionsegypt) → Haytham Mohamed lists "test"; Marketing and Tech "No skill types yet"; same behaviour'),
I('Pressing Enter in the rename box does not save; Save does. Rename shows no toast (Add and Delete do)'),
I('GET /desk/skill-types with no department → 404 "Department 00000000-0000-0000-0000-000000000000 was not found." Any old client calling it gets this message'),
];
const comment='<p><strong>Retest PASS — 8 Nov 2026</strong> → moved to Done<br>Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge (headless) + API; owner + Desk Agent · QA AS6 Dept A / Dept B · Zoho Desk org techsolutionsegypt<br>Method: screen and API</p><p>Skill types now belong to the selected department, like Zoho. The developer\'s numbers held: 40 departments, 248 skills.</p><p>Checked:</p>'+ul(checks)+'<p>Not checked in Zoho: adding a new type and then viewing another department. Zoho was compared from the existing lists.</p><p>Evidence: NDC-2821-retest-PASS.png (attached)</p>';
fs.writeFileSync(path.join(RUN,'plane-draft.json'),JSON.stringify({ticket:'NDC-2821',id:'24515c5e-b896-49b9-afca-23284f41dad5',state_to:'Done',attach:'screenshots/annotated/NDC-2821-retest-PASS.png',comment_html:comment,cleanup_plan:'QA RT14 types/skill/department/tickets; QA AS6 Type + Type3 in the 38 non-QA departments; see ledger.md'},null,1));
const b64='data:image/png;base64,'+fs.readFileSync(path.join(RUN,'screenshots/annotated/NDC-2821-retest-PASS.png')).toString('base64');
const css='<style>body{font:14px/1.55 system-ui,"Segoe UI",sans-serif;background:#f6f7f9;color:#1d2330;max-width:1100px;margin:auto;padding:20px}.b{background:#fff;border:1px solid #e2e5ea;border-radius:10px;padding:14px 20px;margin:14px 0}img{width:100%;border:1px solid #ccc;border-radius:6px}code{background:#eef0f4;padding:1px 4px;border-radius:4px}.w{color:#b00;font-weight:600}</style>';
const cleanup='<div class="b"><h3>Cleanup plan (after Plane)</h3>'+ul(['QA RT14 alpha, QA RT14 beta2 + skill QA RT14 skill beta in Dept B','Department QA RT14 Dept New','Tickets from this retest (ledger.md)','QA AS6 Type and QA AS6 Type3 copied into the non-QA departments by the release, where no skill uses them. These came from my 6 Nov test data. The QA AS6 departments stay until the Assignment Rules cleanup you\'ll call separately.'])+'</div>';
fs.writeFileSync(path.join(RUN,'plane-draft.html'),'<!doctype html><meta charset=utf-8><title>Plane draft NDC-2821</title>'+css+'<h1>Plane draft: NDC-2821</h1><p class=w>Draft only. Nothing posted until you approve.</p><div class=b><b>State:</b> Ready For Test → Done<br><b>Attach:</b> NDC-2821-retest-PASS.png</div><div class=b><h3>Comment</h3>'+comment+'</div><div class=b><h3>Image</h3><a target=_blank href="'+b64+'"><img src="'+b64+'"></a></div>'+cleanup);
fs.writeFileSync(path.join(RUN,'report.html'),'<!doctype html><meta charset=utf-8><title>Retest NDC-2821</title>'+css+'<h1>Retest NDC-2821: PASS</h1><div class=b><b>Developer\'s note:</b> per-department types, live 8 Nov; 11 of 11 passed, 40 departments, 248 skills. Held.</div><div class=b><h3>Checks</h3>'+ul(checks)+'</div><div class=b><h3>Evidence</h3><img src="'+b64+'"></div>'+cleanup);
console.log('ok');
