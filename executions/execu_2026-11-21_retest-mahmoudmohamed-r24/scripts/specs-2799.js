const fs=require('fs'),path=require('path');const D=__dirname;const W=s=>fs.writeFileSync(path.join(D,'specs24',s.ticket+'.json'),JSON.stringify(s,null,1));const C=c=>fs.writeFileSync(path.join(D,'cards24',c.out.replace('.png','.json')),JSON.stringify(c,null,1));
C({out:'2799-api-card.png',host:'staging-desk.taviportal.com',who:'owner account; customer = QA Gmail; third party = QA Gmail on customer2 tickets',date:'21 Nov 2026',title:'NDC-2799 · Item 10 reply part · Customer Support · 4 QA blueprints, On Hold → "QA back" on reply → Escalated · "For these replies" = private / public / all / not set',rows:[
['1 Save checks','POST blueprint with onReplyThreads "xyz" · with threads but no reply transition','422 "\'xyz\' is not a reply thread" · 422 "names reply threads but no transition for a reply"','ok'],
['2 Customer reply, Customer replies (PUB1 #5976)','Gmail replies to the agent mail [#5976] 18:22 UTC','message.received match HeaderChain → blueprint "QA back" → Escalated','ok'],
['3 Customer reply, Both (ALL2 #5978)','Gmail replies [#5978]','match HeaderChain → "QA back" → Escalated','ok'],
['4 Customer reply, Private thread answers (PRIV1 #5975)','Gmail replies [#5975]','No blueprint transition (correct) · but 6 s later engine sets status On Hold → Open; blueprint state now "Open" with no transition','bad'],
['5 Private answer, Private thread answers (PRIV2 #5984)','Forward (Private thread) to Gmail 18:25 · Gmail replies "Re: … [#5984]" 18:27','match None → new ticket #5988 (blueprint "Tickets from Mail"); #5984 stays On Hold, no inbound reply','bad'],
['6 Private answer, Both (ALL3 #5986)','Forward to Gmail · reply "Re: … [#5986]"','match None → new ticket #5989; #5986 stays On Hold','bad'],
['7 Private answer, Customer replies / not set (PUB2 #5985, DEF2 #5987)','Forward to Gmail · reply','match None → new tickets #5990, #5991 (no move, but only because the answer never reached the ticket)','info'],
['8 Out-of-office auto-reply','—','Not run','info']]});
W({out:'NDC-2799-retest-FAIL.png',ticket:'NDC-2799',priority:'medium',label:'RETEST FAIL',verdict:'FAIL',title:'Blueprint: Zoho Desk features still missing after NDC-2754',
 env:'NDC-Staging · staging-desk.taviportal.com · Edge + API · owner · Customer Support · QA Gmail as customer / third party',date:'21 Nov 2026',
 panels:[{img:'2799-d-PRIV2.png',w:1600,h:900,crop:[0,60,1250,400],caption:'#5984 (Private thread answers): the private message to Gmail is on the ticket, the ticket is still On Hold; the Gmail answers became new tickets #5988–#5991',boxes:[{b:[14,112,306,696],n:5},{b:[682,268,1590,392],n:6},{b:[798,140,1120,206],n:7}]},
  {img:'2799-f-PRIV1-history.png',w:1600,h:900,crop:[370,55,1230,670],caption:'#5975 (Private thread answers) › History: a customer reply did not run the transition, but the status went On Hold → Open by itself',boxes:[{b:[704,352,930,436],n:4},{b:[382,552,650,690],n:8}]},
  {img:'2799-api-card.png',full:true,crop:[0,0,1600,650],w:1600,h:900,caption:'API: save checks and every reply case'}],
 rows:[[1,'Save refuses an unknown value / threads without a reply transition','Refused','422 with clear messages','PASS'],
 [2,'Customer replies (default): customer reply','Runs the transition','#5976 → Escalated','PASS'],
 [3,'Both: customer reply','Runs the transition','#5978 → Escalated','PASS'],
 [4,'Private thread answers: customer reply','Ticket stays where it was (dev note)','No transition, but status On Hold → Open by the system','FAIL'],
 [5,'Private thread answers: third party answers the private message','Answer added to the ticket; transition runs','Answer becomes a new ticket (#5988); #5984 stays On Hold','FAIL'],
 [6,'Both: third party answers the private message','Transition runs','New ticket #5989; #5986 stays On Hold','FAIL'],
 [7,'Customer replies / not set: third party answers','No move, no reopen','No move, but the answer is not on the ticket (#5990, #5991)','INFO'],
 [8,'Out-of-office auto-reply to a private message','Never runs the transition','Not run','INFO'],
 ['Z7','Item 7: widgets in the transition form','—','Still not built (blocked, dev note)','INFO']]});
