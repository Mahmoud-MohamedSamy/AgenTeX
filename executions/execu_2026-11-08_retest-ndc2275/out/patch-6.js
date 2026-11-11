const fs=require('fs');const p=__dirname+'/checklist-verdicts.js';let s=fs.readFileSync(p,'utf8');
const a=s.indexOf("{id:'EM-04'");const b=s.indexOf("\n{id:",a+5);if(a<0||b<0)throw 'miss';
let e=s.slice(a,b);
e=e.replace(/v:'BLOCKED',k:'[^']*'/,"v:'PASS',k:'Rerun 15:46 UTC from Gmail: your reply landed on #2661 as an incoming message 3 min after the agent reply (HeaderChain match); no new ticket. Earlier attempts were invalid (see below).'");
e=e.replace("d:ul([","d:ul(['<b>Rerun 10 Nov 15:46–15:49 UTC (valid):</b> new Gmail email \"QA EM-04 Gmail rerun\" opened #2661 in Customer Support at 15:46:42 (match None, trusted, DKIM aligned). Agent reply sent from the ticket page at 15:47:32. Your Gmail reply arrived at 15:49:19 on #2661 (match <code>HeaderChain</code>, trusted, DKIM aligned); the search finds only one ticket with that subject. The blueprint \"Tickets from Mail\" set the status to Reopened. The tab says \"4 CONVERSATION\" while the API lists 3 messages (2 in, 1 out).',");
e=e.replace(/\+need\('[^']*'\)/,'');
e=e.replace(/\+img\('cl-em04-2503\.png'/,"+img('cl-em04r-3-reply-in.png','#2661 after the rerun: your Gmail email, the agent reply, and your Gmail reply on the same ticket')+img('cl-em04-2503.png'");
s=s.slice(0,a)+e+s.slice(b);fs.writeFileSync(p,s);console.log('ok');
