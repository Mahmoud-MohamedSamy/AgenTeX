const fs=require('fs');const p=__dirname+'/checklist-verdicts.js';let s=fs.readFileSync(p,'utf8');
const rep=(id,txt)=>{const a=s.indexOf("{id:'"+id+"'");const b=s.indexOf("\n{id:",a+5);if(a<0||b<0)throw id;s=s.slice(0,a)+txt+s.slice(b);};
rep('EM-01',`{id:'EM-01',t:'New email from an outside address creates a ticket',v:'PASS',k:'Your Gmail email became #2495 in Customer Support, channel Email, 4 seconds after it was received.',
 d:ul(['You sent "QA EM-01 new email Gmail &lt;1:38 PM&gt;" from your Gmail address to customer-support@help-staging.anyware.software.',
 'History: <code>message.received</code> at 11:39:02 UTC (trusted, DKIM aligned), ticket <b>#2495</b> created at 11:39:06 in <b>Customer Support</b>, channel Email, owner Unassigned, Status Open, blueprint "Tickets from Mail" entered.',
 'The email text is the first incoming message, from the Gmail address to the Customer Support address.',
 'Contact: the Gmail address matched an existing contact named "QA AO NT07z9ci", created earlier by the automation session with the same address, so the ticket shows that name. That is correct matching by email, not a bug.',
 'Check later: the tab reads "2 CONVERSATION" while one message is shown.'])+img('cl-em-01-2495.png','#2495 from Gmail in Customer Support')},`);
rep('EM-02',`{id:'EM-02',t:'New email from the company domain creates a ticket',v:'PASS',k:'Your email from mmohamed@anyware.software became #2496 in Customer Support.',
 d:ul(['Sent from mmohamed@anyware.software at 1:39 PM Cairo (you reused the subject "QA EM-01 new email Gmail &lt;1:39 PM&gt;").',
 'History: <code>message.received</code> at 11:39:20 UTC (trusted, DKIM <b>not</b> aligned), ticket <b>#2496</b> created at 11:39:24 in Customer Support, channel Email, contact mmohamed@anyware.software, first incoming message from that address.',
 'Both EM-01 and EM-02 pass, so new mail reaches TAVI from outside and from the company domain.'])+img('cl-em-01-2496.png','#2496 from mmohamed@anyware.software')},`);
rep('EM-06',`{id:'EM-06',t:'Second receiving address',v:'PASS',k:'Email to tech@help-staging… became #2498 in Tech.',
 d:ul(['You sent "QA EM-06 Tech &lt;1:40&gt;" from Gmail to tech@help-staging.anyware.software.',
 'History: <code>message.received</code> at 11:41:12 UTC (trusted, DKIM aligned), ticket <b>#2498</b> created at 11:41:15 in the <b>Tech</b> department, channel Email.',
 'So both receiving addresses work.'])+img('cl-em-06-2498.png','#2498 in Tech')},`);
fs.writeFileSync(p,s);console.log('patched');
