// Comment-only BLOCKED retest on NDC-3000 (user asked 17 Nov 2026). No state change.
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');
const rows=fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv','utf8').trim().split(/\r?\n/).map(l=>l.split(','));
const ki=rows[0].findIndex(h=>/secret key/i.test(h));const H={'X-API-Key':rows[1][ki>=0?ki:rows[0].length-1].replace(/"/g,'').trim(),'Content-Type':'application/json'};
const B='https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3';const ID='b1973014-edce-4e87-adf6-8d8db41dee05';
const html=`<p><strong>Retest BLOCKED — 17 Nov 2026</strong> → state not changed (stays Ready For Test)<br>Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge + API; account: ndc-staging-owner (owner); customer = the QA lead's own Gmail<br>Method: Manual (real email from the customer mailbox) + API</p>
<p>Checked:</p><ul>
<li>Acknowledgement setup → channel acknowledgement on; department rules "Receiving a new ticket" and "Acknowledging a reply" on; department's own receiving address (active, verified, receiving) [INFO]</li>
<li>Ticket not opened by email (#4691, API) → no acknowledgement, by design (only inbound email gets one) [INFO]</li>
<li>Closed email with ratings limited to the department (#4678) → arrived in the customer inbox with Bad / Okay / Good [PASS]</li>
<li>Customer emails the support address (#4745, 16 Nov 15:44 UTC) → acknowledgement "Re: QA RT19 NTF 3000 ack test [#4745]" — "Your ticket has been delivered, we will contact you soon. #4745" received once in the customer inbox [PASS]</li>
<li>Customer replies to that acknowledgement (17 Nov 07:58 UTC, sent to the support address, Reply-To correct) → never reached #4745 and created no ticket [BLOCKED]</li>
<li>Control: two new emails to the same address ("QA RT19 NTF 3000 inbound check" ~08:16 UTC, "… inbound check 02" 11:37 UTC) → no ticket created; address still active/verified/receiving, quarantine empty [BLOCKED]</li></ul>
<p>Blocked: staging has received no email since 16 Nov 15:44 UTC (#4745 is the last one), so the reply acknowledgement cannot be tested. Not counted as a failure of this fix. The same outage also stopped ticket history events, closed time, round-robin assignment and ticket numbers on staging today. To finish: once inbound email works again, the customer replies to #4745 and the reply acknowledgement is checked.</p>
<p>Evidence: NDC-3000-retest-BLOCKED.png (attached; addresses hidden)</p>`;
(async()=>{const w=await (await fetch(`${B}/work-items/${ID}/`,{headers:H})).json();if(w.state!=='f5299bf6-0dfc-4d40-9223-da9c1fab09b1'){console.log('state changed',w.state);return;}
const r=await fetch(`${B}/work-items/${ID}/comments/`,{method:'POST',headers:H,body:JSON.stringify({comment_html:html})});console.log('comment',r.status);
execFileSync('node',[path.join(__dirname,'plane-attach.js'),ID,path.join(__dirname,'../screenshots/annotated/NDC-3000-retest-BLOCKED.png')]);
const a=await (await fetch(`${B}/work-items/${ID}/attachments/`,{headers:H})).json();const w2=await (await fetch(`${B}/work-items/${ID}/`,{headers:H})).json();
console.log('attachments',(a.results||a).map(f=>f.attributes&&f.attributes.name).join(', '),'| state still RFT:',w2.state==='f5299bf6-0dfc-4d40-9223-da9c1fab09b1');})().catch(e=>console.error('ERR',String(e.message).replace(/plane_[A-Za-z0-9_-]+/g,'<key>')));
