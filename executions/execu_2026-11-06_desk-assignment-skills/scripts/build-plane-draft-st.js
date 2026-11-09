// Draft (NOT posted): skill types per department bug. Builds plane-draft-ST.json + plane-draft-ST.html. Usage: node build-plane-draft-st.js
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const IMG = 'screenshots/annotated/ST-skill-types-not-per-department-vs-zoho.png';
const ENV = 'Environment: staging-desk.taviportal.com, tenant NDC-Staging, owner account, Edge + API. Zoho Desk reference: org techsolutionsegypt, department Haytham Mohamed. Checked 8 Nov 2026.';
const ol = a => '<ol>' + a.map(x => `<li>${x}</li>`).join('') + '</ol>';
const ul = a => '<ul>' + a.map(x => `<li>${x}</li>`).join('') + '</ul>';
const desc =
  `<p>Skill types are one list shared by every department. In Zoho Desk, skill types are managed per department, like skills. TAVI's skills are already per department, but their types are not.</p>` +
  `<p><strong>Steps</strong></p>` + ol([
    'Go to Setup → Customization → Skills → <strong>Skills</strong> tab. Note the <strong>Department</strong> picker: skills belong to one department.',
    'Open the <strong>Skill Types</strong> tab.',
    'Look for a department picker, and read the help text above the list.',
  ]) +
  `<p><strong>Expected</strong></p><p>The Skill Types tab has the same department picker as the Skills tab, and each department has its own list of skill types, as in Zoho Desk (Setup → Skills → SKILL TYPES keeps the department picker; the list sits under the selected department).</p>` +
  `<p><strong>Actual</strong></p>` + ul([
    'The Skill Types tab has no department picker. Its help text says "Skill types group skills, such as Languages or Products. <strong>Every department uses the same types.</strong>"',
    'One list is shown for all departments (on NDC-Staging: General, Tech, QA AS6 Type, QA AS6 Type3). Every department sees and uses every type; a type cannot be limited to one department.',
    'The API matches the screen: <code>GET /desk/skill-types</code> returns one list with no department.',
  ]) +
  `<p><strong>Notes</strong></p>` + ul([
    'Skills themselves are per department in TAVI (Skills tab has a Department picker), so only the types are affected.',
    'Deleting a skill type that skills still use is refused in both products with a clear message. TAVI: "Skills still have this skill type. Give them another type first." Zoho: "The skill type could not be deleted because it is associated with one or more skills." That part works and is not part of this bug.',
    'Zoho side: only department Haytham Mohamed was opened; other departments\' lists were not compared.',
  ]) +
  `<p><strong>Environment</strong></p><p>${ENV}</p>` +
  `<p><strong>Evidence</strong></p><p>ST-skill-types-not-per-department-vs-zoho.png (attached): TAVI on the left, Zoho Desk on the right, same box numbers on both sides.</p>`;

const draft = {
  note: 'DRAFT ONLY — nothing posted. Waiting for the user\'s approval.',
  project_id: 'efce4d84-5876-4015-b472-2efca7ad73f3',
  key: 'B-6',
  name: 'Assignment Rules | Skill types are shared by all departments instead of being set per department',
  priority: 'medium',
  state: 'Bug (34a7f4b6-7207-4955-b927-0d8d1dd3c666)',
  labels: ['5ad0a95a-678e-4485-845d-bb93c27dce36'],
  module: 'Desk (274a73de-564a-4b8c-8b51-74fe8304e7c2)',
  cycle: 'Sprint 15 (3a5ac486-3f65-4632-ab05-8f790e61c7b0)',
  assignees: ['MahmoudMohamed', 'mfathy', 'Hegazy'],
  relates_to: ['NDC-2752', 'NDC-1978'],
  attach: IMG,
  description_html: desc,
};
fs.writeFileSync(path.join(RUN, 'plane-draft-ST.json'), JSON.stringify(draft, null, 2));
const b64 = 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, IMG)).toString('base64');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Plane draft — skill types per department</title>
<style>body{font:14px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#f6f7f9;color:#1d2330;max-width:1100px;margin:auto;padding:20px}
.box{background:#fff;border:1px solid #e2e5ea;border-radius:10px;padding:16px 20px;margin:14px 0}.meta td{padding:3px 12px 3px 0;vertical-align:top}.meta td:first-child{color:#5d6677;width:120px}
.warn{color:#b00;font-weight:600}code{background:#eef0f4;padding:1px 5px;border-radius:4px}img{width:100%;border:1px solid #ccc;border-radius:6px}</style></head><body>
<h1>Plane draft — new bug (not posted)</h1><p class="warn">Draft only. Nothing is posted until you approve.</p>
<div class="box"><table class="meta">
<tr><td>Title</td><td><strong>${draft.name}</strong></td></tr>
<tr><td>Project</td><td>NDC</td></tr><tr><td>Priority</td><td>Medium</td></tr><tr><td>State</td><td>Bug</td></tr>
<tr><td>Label</td><td>Assignment Rules</td></tr><tr><td>Module</td><td>Desk</td></tr><tr><td>Cycle</td><td>Sprint 15</td></tr>
<tr><td>Assignees</td><td>${draft.assignees.join(', ')}</td></tr><tr><td>Relates to</td><td>${draft.relates_to.join(', ')}</td></tr>
<tr><td>Attachment</td><td>${path.basename(IMG)}</td></tr></table></div>
<div class="box"><h3 style="margin-top:0">Description</h3>${desc}</div>
<div class="box"><h3 style="margin-top:0">Attached image</h3><a href="${b64}" target="_blank"><img src="${b64}" alt="evidence"></a></div></body></html>`;
fs.writeFileSync(path.join(RUN, 'plane-draft-ST.html'), html);
console.log('plane-draft-ST.json + plane-draft-ST.html');
