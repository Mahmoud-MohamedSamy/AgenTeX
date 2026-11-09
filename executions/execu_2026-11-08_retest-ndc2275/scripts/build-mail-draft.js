const fs=require('fs'),path=require('path');const RUN=path.join(__dirname,'..');
const title='Email Channel | Customer email replies to the department address never reach Desk, while Setup says "Mail is arriving"';
const d=`<h3>Summary</h3>
<p>An agent reply from a ticket goes out correctly, but when the customer answers it, the answer never reaches Desk: it doesn't appear on the ticket and no new ticket is created. At the same time, Setup › Channels › Email says "Mail is arriving. Customers can write in, and replies go out. Nothing is waiting on you." and shows 4 of 4 steps done. Customers' email replies are lost without any warning to agents or admins.</p>
<h3>Steps to Reproduce</h3>
<ol>
<li>Open a ticket in the Customer Support department (receiving address customer-support@help-staging.anyware.software) whose contact is a real mailbox (here ticket #1, contact mmohamed@anyware.software).</li>
<li>Reply to the customer from the ticket. The reply goes out from Customer Support &lt;customer-support@help-staging.anyware.software&gt; with subject "Re: Check-in" and arrives in the customer's mailbox.</li>
<li>From the customer's mailbox, use Reply on that email (subject "Re: Check-in", To customer-support@help-staging.anyware.software) and send a short text.</li>
<li>Wait and open the ticket in Desk. Also check the ticket list and Setup › Channels › Email.</li>
</ol>
<h3>Expected Result</h3>
<p>The customer's answer appears on the same ticket as an incoming (customer) message within a few minutes. If it can't be matched to the ticket, it creates a new ticket or appears somewhere an admin can see it (quarantine, spam, an error on the Email page). The Email page only says "Mail is arriving" when incoming mail is really being received.</p>
<h3>Actual Result</h3>
<ul>
<li>Agent reply sent 9 Nov 14:50 (Cairo), received by the customer at 14:50.</li>
<li>Customer reply sent at 15:30 to customer-support@help-staging.anyware.software, text "test reply".</li>
<li>At 16:12 (42 minutes later) ticket #1 still showed only the agent reply. No new ticket was created from that address. Suppressions were empty; Quarantine and Spam were empty earlier and returned a server error ("An unexpected error occurred") at 15:55.</li>
<li>Setup › Channels › Email at the same time: "Mail is arriving. Customers can write in, and replies go out. Nothing is waiting on you.", 4 of 4 done, "Mail sent to customer-support@help-staging.anyware.software becomes a ticket". It also showed "The mail provider did not answer when we checked taviportal.com." The address record shows receiving on, verified 14 Oct, with no receiving health data.</li>
</ul>
<h3>Environment</h3>
<p>staging-desk.taviportal.com, tenant NDC-Staging, owner account (ndc-staging-owner), Edge; customer mailbox mmohamed@anyware.software (Zoho Mail). Found while testing the round robin 30-day rule (NDC-2275): a customer reply was needed on an old ticket.</p>
<p>Evidence: MAIL-inbound-reply-not-received.png (attached)</p>`;
const j={note:'DRAFT ONLY. Nothing posted.',name:title,priority:'high',state:'Bug',label:'Email Channel',module:'Desk',cycle:'Sprint 15',assignees:'same three as NDC-2824 (change if another developer owns email)',relates:['NDC-2275'],description_html:d,attach:'screenshots/annotated/MAIL-inbound-reply-not-received.png'};
fs.writeFileSync(path.join(RUN,'plane-draft-mail.json'),JSON.stringify(j,null,1));
const img='data:image/png;base64,'+fs.readFileSync(path.join(RUN,j.attach)).toString('base64');
fs.writeFileSync(path.join(RUN,'plane-draft-mail.html'),`<!doctype html><meta charset="utf-8"><title>Email bug draft</title><style>body{font:15px/1.55 Segoe UI,sans-serif;max-width:1000px;margin:24px auto;padding:0 16px;color:#111}.box{border:1px solid #ccc;border-radius:8px;padding:16px;margin:12px 0}.m{color:#555;font-size:13px}img{max-width:100%;border:1px solid #ddd}h3{margin:18px 0 6px}</style>
<h2>Plane draft: new bug (email channel)</h2><p class="m">DRAFT ONLY, not posted.</p><div class="box"><p><strong>${title.replace(/</g,'&lt;')}</strong></p><p class="m">Priority: High (proposed) · State: Bug · Label: Email Channel · Module: Desk · Cycle: Sprint 15 · Assignees: same three as NDC-2824 (change if another developer owns email) · Relates to NDC-2275</p>${d}</div><h3>Attachment</h3><img src="${img}">`);console.log('ok');
