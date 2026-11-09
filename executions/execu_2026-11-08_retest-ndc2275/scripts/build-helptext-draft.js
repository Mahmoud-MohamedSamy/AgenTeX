const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');
const c=`<p><strong>Import help text — 9 Nov 2026</strong></p>
<p>Import → Assign, the help text under "Trigger automation and process management" ends: "Owner assignment from the chosen rule runs regardless". Import has no rule to choose, so the sentence points to something that isn't there.</p>
<p>Please reword it to say what actually happens: rows with no owner are assigned to the person importing.</p>
<p>Zoho Desk (checked live 9 Nov) has no rule or owner option and no text about a rule on any import step.</p>
<p>Evidence: NDC-2275-import-help-text.png (attached)</p>`;
const d={note:'DRAFT ONLY. Nothing posted.',item:'NDC-2275',expected_state:'Bug',state_change:'none',comment_html:c,attach:'screenshots/annotated/NDC-2275-import-help-text.png'};
fs.writeFileSync(path.join(RUN,'plane-draft-helptext.json'),JSON.stringify(d,null,1));
const img='data:image/png;base64,'+fs.readFileSync(path.join(RUN,d.attach)).toString('base64');
fs.writeFileSync(path.join(RUN,'plane-draft-helptext.html'),`<!doctype html><meta charset="utf-8"><title>NDC-2275 help text draft</title><style>body{font:15px/1.5 Segoe UI,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#111}.box{border:1px solid #ccc;border-radius:8px;padding:16px;margin:12px 0}.m{color:#555;font-size:13px}img{max-width:100%;border:1px solid #ddd}</style><h2>Plane draft: NDC-2275 comment (import help text)</h2><p class="m">DRAFT ONLY, nothing posted. State stays <b>Bug</b>. Replaces the longer GEN-13 draft.</p><div class="box">${c}</div><h3>Attachment</h3><img src="${img}">`);console.log('ok');
