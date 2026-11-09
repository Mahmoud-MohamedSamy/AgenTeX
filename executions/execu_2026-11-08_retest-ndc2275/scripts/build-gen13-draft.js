const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');
const c=`<p><strong>GEN-13 import: follow-up, 9 Nov 2026</strong></p>
<p>The 8 Nov retest left GEN-13 "to decide". It is now decided: rules don't run on import, and rows with no owner stay with the person importing (as in the 6 Nov fix note). Only the wording on the Assign step needs a change.</p>
<p><strong>Compared with Zoho Desk</strong> (test account, 9 Nov, temporary round robin rule on Ticket Create, 2-row import with no owner column):</p>
<ul>
<li>Import wizard → no rule, owner or automation option on any step. TAVI has no rule picker either. [SAME]</li>
<li>Round robin on imported tickets → Zoho did not apply it (#104, #105: History only "New ticket created through import"). TAVI doesn't either, box ticked or not (#1681–#1684). [SAME]</li>
<li>Same rule on a ticket made by hand → Zoho assigned it (#103, "Ticket was assigned through a Round Robin Rule"); TAVI assigns it too (#1660). [SAME]</li>
<li>Owner of rows with no owner → Zoho leaves them Unassigned; TAVI gives them to the person importing. Kept as designed (QA decision). [DECISION]</li>
</ul>
<p><strong>Please change</strong></p>
<ul><li>Import → Assign, help text under "Trigger automation and process management": "Owner assignment from the chosen rule runs regardless". No rule can be chosen on import, so this should say what happens instead, for example: "Rows without an owner are assigned to you."</li></ul>
<p>The requirement line "import (rules on) is assigned by the same matching rule" no longer applies. NF-3 (threshold exceeded by one under simultaneous creates) is still open, so the state stays Bug.</p>
<p>Evidence: NDC-2275-GEN13-import-vs-zoho.png (attached)</p>`;
const d={note:'DRAFT ONLY. Nothing posted.',item:'NDC-2275',expected_state:'Bug',state_change:'none',comment_html:c,attach:'screenshots/annotated/NDC-2275-GEN13-import-vs-zoho.png'};
fs.writeFileSync(path.join(RUN,'plane-draft-gen13.json'),JSON.stringify(d,null,1));
const img='data:image/png;base64,'+fs.readFileSync(path.join(RUN,d.attach)).toString('base64');
fs.writeFileSync(path.join(RUN,'plane-draft-gen13.html'),`<!doctype html><meta charset="utf-8"><title>NDC-2275 GEN-13 draft</title><style>body{font:15px/1.5 Segoe UI,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#111}.box{border:1px solid #ccc;border-radius:8px;padding:16px;margin:12px 0}.m{color:#555;font-size:13px}img{max-width:100%;border:1px solid #ddd}</style>
<h2>Plane draft: NDC-2275 comment (GEN-13 follow-up)</h2><p class="m">DRAFT ONLY, nothing posted. State: stays <b>Bug</b> (no change). Attachment: NDC-2275-GEN13-import-vs-zoho.png</p><div class="box">${c}</div><h3>Attachment</h3><img src="${img}">`);
console.log('ok');
