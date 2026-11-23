const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const comment=`<p><strong>Retest FAIL — 22 Nov 2026</strong> → moved to Bug<br>Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge + API; account: ndc-staging-owner (owner)<br>Method: Manual browser + API; customer reply sent from mmohamed@anyware.software</p>
<p>Checked:</p><ul>
<li>Customer reply reaches Desk (steps 2–4): agent mail from #6235 at 08:35 UTC → customer reply on #6235 at 08:40:30 UTC (match HeaderChain), no new ticket [PASS]</li>
<li>Overview after a real mail arrived (reloaded 08:47 UTC) [FAIL, see below]</li></ul>
<p>Still failing:</p><ul>
<li><strong>Overview status</strong>: expected a headline from real inbound mail ("Mail is arriving", or a warning when mail waits); actual "We could not check — the check itself failed" on every load.</li>
<li><strong>Last email received</strong>: expected "Last email received &lt;time&gt;" (here 22 Nov, 10:40 AM Cairo); actual not shown anywhere on the page.</li>
<li><strong>Endpoint</strong>: GET /api/v1/desk/channels/inbound-health → 404 NOT_FOUND, on page load and 6 direct calls between 08:15 and 08:47 UTC. The page calls it, but staging does not serve it, so the desk part of the fix (desk #272) looks missing or rolled back on staging.</li></ul>
<p>Differs from the developer's note (not the reason for the FAIL):</p><ul>
<li>The 9 Nov reply "Re: Check-in" was saved on 21 Nov 18:50 UTC as a new ticket #5992 (message.received match None), not as a reply on #1 "Check-in", which sent the agent mail on 9 Nov 12:50 UTC. #1 had been moved to Marketing and closed on 9 Nov, so this may be by design. Both tickets were later deleted by another tester's cleanup.</li></ul>
<p>Not checked: the red "Customer mail is not reaching tickets" state (needs an email stuck for over an hour; developer-only check).</p>
<p>Evidence: NDC-2837-retest-FAIL.png (attached)</p>`;
const img='NDC-2837-retest-FAIL.png';
const draft={round:'r25',date:'2026-11-22',items:[{ticket:'NDC-2837',workitem_id:'3de3c037-4a7b-455c-92b6-c20859ecfc43',verdict:'FAIL',state_from:'Ready For Test',state_to:'Bug',comment_html:comment,attachments:[img]}],
already_posted:[{ticket:'NDC-2997',note:'Regression PASS comment + NDC-2997-retest-PASS.png posted 22 Nov 10:37 Cairo (stays Done)'}],
cleanup:['Desk tickets QA RT25 W2 2997 (#6217-6219, #6221-6223, #6225-6228, #6230-6232) + QA RT25 2837 #6235 → delete + purge from Recycle Bin','#6214-6216 already deleted by another session 08:32 UTC → purge from bin','6 workflow rules QA RT25 W2 2997 (ouCS, ouQAO, prEmpty, prQAO, mgrQAO, seq; all deactivated) → delete','#6213 (first mail ticket) already gone','Stop keeper, delete scratchpad sign-in state']};
fs.writeFileSync(R+'/plane-draft.json',JSON.stringify(draft,null,1));
const b64=fs.readFileSync(R+'/screenshots/annotated/'+img).toString('base64');
const html=`<!doctype html><html><head><meta charset="utf-8"><title>Plane draft r25 — NDC-2837</title><style>body{font:15px/1.5 "Segoe UI",sans-serif;max-width:1100px;margin:24px auto;color:#111827;padding:0 16px}h1{font-size:22px}.card{border:1px solid #d1d5db;border-radius:8px;padding:16px 20px;margin:16px 0}.pill{display:inline-block;padding:2px 10px;border-radius:12px;color:#fff;font-weight:600;font-size:13px}.c{background:#f9fafb;border-left:4px solid #6366f1;padding:8px 16px}img{max-width:100%;border:1px solid #e5e7eb}code{background:#f3f4f6;padding:1px 4px}</style></head><body>
<h1>Plane draft — retest r25 (22 Nov 2026)</h1><p>Nothing below is posted until you approve.</p>
<div class="card"><h2>NDC-2837 <span class="pill" style="background:#dc2626">FAIL</span></h2><p><b>State:</b> Ready For Test → <b>Bug</b> &nbsp; <b>Attach:</b> <code>${img}</code></p><p><b>Comment, exactly as posted:</b></p><div class="c">${comment}</div><p><b>Image:</b></p><img src="data:image/png;base64,${b64}"></div>
<div class="card"><h2>Already posted</h2><p>NDC-2997: regression PASS comment + NDC-2997-retest-PASS.png (22 Nov, 10:37 Cairo). State stays Done.</p></div>
<div class="card"><h2>Cleanup after posting</h2><ul>${draft.cleanup.map(x=>'<li>'+x+'</li>').join('')}</ul></div></body></html>`;
fs.writeFileSync(R+'/plane-draft.html',html);console.log('ok');
