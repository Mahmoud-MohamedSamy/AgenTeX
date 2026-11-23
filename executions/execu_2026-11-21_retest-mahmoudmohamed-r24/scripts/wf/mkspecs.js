const fs=require('fs');const W=(n,o)=>fs.writeFileSync(`specs/NDC-${n}.json`,JSON.stringify({out:`NDC-${n}-retest-${o.verdict}.png`,ticket:`NDC-${n}`,date:'16 Nov 2026',...o},null,1));
const EX=[270,60,1290,520], ROW=[292,395,1268,502];
const C={
'2962':[[36,99,1564,157],[36,167,1564,246],[36,256,1564,314],[36,324,1564,382],[36,392,1564,450],[36,460,1564,518],[36,528,1564,586]],
'2967':[[36,99,1564,136],[36,146,1564,183],[36,193,1564,230],[36,240,1564,298],[36,308,1564,345],[36,355,1564,413],[36,423,1564,460]],
'2997':[[36,99,1564,136],[36,146,1564,204],[36,214,1564,251],[36,261,1564,319],[36,329,1564,366],[36,376,1564,413],[36,423,1564,460]],
'2968':[[36,99,1564,157],[36,167,1564,204],[36,214,1564,272],[36,282,1564,340]],
'2973':[[36,99,1564,157],[36,167,1564,204],[36,214,1564,251],[36,261,1564,319],[36,329,1564,387],[36,397,1564,434]],
'2966':[[36,99,1564,157],[36,167,1564,225],[36,235,1564,272]]};
const card=(img,rows,kind)=>({img,caption:'API evidence (owner, NDC-Staging)',crop:[0,0,1600,Math.max(...rows.map(r=>r[3]))+20],boxes:rows.map((r,i)=>({b:r,n:i+1,kind:kind[i]}))});
W(2962,{priority:'high',title:'Workflow Rules | A line break in a webhook header value adds an extra header to the outgoing request',verdict:'PASS',
 env:"NDC-Staging · staging-desk · owner · dept QA RT19 WF Dept · webhooks to https://qa-rt19.invalid (never resolves) and to staging-desk's own API /api/v1/qa-rt19-probe (no public receiver) · tickets #4183, #4188, #4190",
 panels:[card('2962-api-card.png',C['2962'],['PASS','PASS','PASS','PASS','PASS','INFO','INFO']),
  {img:'2962-2-exec-injected.png',caption:'Execution History for #4190 (header X-QA-Desc: ${description}, description holds a line break + "Authorization: Bearer …"): HTTP 401, server answered TOKEN_MISSING, so no injected header arrived',crop:EX,boxes:[{b:ROW,n:5,kind:'PASS'}]}],
 rows:[[1,'Save a header value / name with a line break or control character','Refused at save','400 with the header named (CRLF, LF, CR, NUL value; CRLF name); a tab is accepted (allowed in HTTP)','PASS'],
  [2,'Save Host, Content-Length, Transfer-Encoding, Connection, non-ASCII','Refused','400 "… is set by the request itself and cannot be changed" / "only ASCII"','PASS'],
  [3,'Other write paths','Refused too','PATCH rule 400; saved action POST/PATCH 400; PUT not available','PASS'],
  [4,'What the webhook sends','Only the configured headers','Webhook to our own staging API: configured Authorization reached it (TOKEN_INVALID); a line break coming from a record value added no header (TOKEN_MISSING); header values are not templated','PASS'],
  [5,'Execution History shows the request headers','—','Not recorded: dispatch row has target, status, HTTP, details only','INFO'],
  [6,'Rule saved before the fix fails once with the reason','Dev claim','Not checkable: no path saves such a header; stored values are masked "********"','INFO']]});
W(2963,{priority:'high',title:'Workflow Rules | Script saved in an Add Comment action runs when an admin opens the rule',verdict:'DECISION',
 env:'NDC-Staging · staging-desk · owner · rule "QA RT19 WF 2963" (45ed37b1) saved through the API with <img src=x onerror="window.__xss=1"> + <b> + javascript: link · ticket #4218',
 panels:[{img:'2963-1b-editor-comment.png',caption:'Rule editor: description shown as plain text; comment editor shows a broken image + bold + link (no onerror, no href), window.__xss unset',crop:[240,60,1400,840],boxes:[{b:[284,146,624,168],n:1,kind:'PASS'},{b:[522,764,838,830],n:2,kind:'INFO'}]},
  {img:'2963-4-ticket-comment.png',caption:'Ticket #4218: the comment the action posted renders the same safe HTML (broken image, bold, link without href); nothing ran',crop:[664,60,1600,340],boxes:[{b:[676,258,860,316],n:3,kind:'INFO'}]}],
 rows:[[1,'Open the rule in the editor','No script runs','onerror / javascript: href stripped; window.__xss unset; no dialog','PASS'],
  [2,'Editor shows the body as plain text','Plain text','Rendered as rich text: broken image, bold, link (safe)','INFO'],
  [3,'Ticket comment posted by the action','Plain text, safe','Safe; rendered as rich text (stored body_html keeps the raw <img onerror>, the screen strips it)','INFO'],
  [4,'Rules list and Execution History','Safe','List row and Execution History show no HTML; window.__xss unset','PASS']]});
W(2967,{priority:'high',title:'Records API | 500 error when "kind" is not the first key of a field value',verdict:'PASS',
 env:'NDC-Staging · staging-desk · owner · POST/PATCH /api/v1/modules/{tickets}/records · tickets in QA RT19 WF Dept',
 panels:[card('2967-api-card.png',C['2967'],['PASS','PASS','PASS','PASS','PASS','PASS','FAIL'])],
 rows:[[1,'{"value":"x","kind":"string"}','201','201, subject stored (was 500)','PASS'],[2,'{"kind":"string","value":"x"}','201','201','PASS'],
  [3,'Every field value-first, PATCH value-first, extra key in between','Accepted','201 / 200, values stored','PASS'],[4,'Unknown kind','400 (dev claim)','400 "The request body could not be read…"','PASS'],
  [5,'No "kind" at all','400','500 INTERNAL_ERROR (twice) — new, not in this ticket','INFO']]});
W(2997,{priority:'high',title:'Workflow Rules | Owner Assignment by role (round robin) never assigns anyone',verdict:'FAIL',
 env:'NDC-Staging · staging-desk · owner · Roles › CEO = OrgUnitRoundRobin 7972984b (request caught from the screen) · QA RT19 WF Dept (CES1 + Test User 1, both CEO) and QA AO Dept A (Dev Team 2 + Test User 1) · Test User 1 signed in and online for one run',
 panels:[card('2997-api-card.png',C['2997'],['INFO','FAIL','FAIL','FAIL','INFO','PASS','PASS']),
  {img:'2997-2-exec-online.png',caption:'Execution History: Owner Assignment OrgUnitRoundRobin CEO Skipped "Not assigned: nobody in the org unit can own a ticket of this department." although Test User 1 (CEO, online) is an agent of the department',crop:EX,boxes:[{b:ROW,n:2,kind:'FAIL'}]}],
 rows:[[1,'Owner Assignment › Roles › CEO, tickets in a department with CEO agents','Owner from the role, taking turns','No owner set on 9 tickets in 2 departments; Skipped "nobody in the org unit can own a ticket of this department"','FAIL'],
  [2,'Same with a CEO agent online','Assigned','Still Skipped (3 tickets)','FAIL'],[3,'Manual assign of the same agents','—','200 (they can own these tickets)','INFO'],
  [4,'No agent can be assigned','Action shows the reason','Skipped with the reason (Dept B, no CEO agent)','PASS'],[5,'Profiles round robin (control)','—','Succeeded, owner CES1','PASS']]});
W(2968,{priority:'medium',title:'Workflow Rules | Create Record action skips required fields and leaves the new record without an owner',verdict:'PASS',
 env:'NDC-Staging · staging-desk · owner · Create Record in Calls · ticket #4238 owned by CES1 in QA RT19 WF Dept · contact "QA RT18 GL Contact"',
 panels:[card('2968-api-card.png',C['2968'],['PASS','PASS','PASS','PASS']),
  {img:'2968-2-exec-empty.png',caption:'Execution History: a required field that comes out empty at run time → Create Record Cancelled with the reason, no Call created',crop:EX,boxes:[{b:ROW,n:4,kind:'PASS'}]}],
 rows:[[1,'Save Create Record in Calls with only Start Time','Refused, fields named','400 "fill in the required fields Subject, Call Status, Contact Name, Department."','PASS'],
  [2,'All required fields; ticket owned by CES1','Call has a real owner','Call created, owner = CES1 (the ticket owner), Department from the ticket, Succeeded','PASS'],
  [3,'Required field from an empty placeholder','Run fails with a clear reason','Cancelled "Not created: Calls needs Subject…", nothing created','PASS'],
  [4,'Created By on the Call','—','System (dev: by design); not checked on screen','INFO']]});
W(2973,{priority:'medium',title:'Workflow Rules | Owner Assignment action assigns suspended agents and agents outside the department',verdict:'PASS',
 env:'NDC-Staging · staging-desk · owner · QA agent "ZZ Sweep Tavi Probe" (member of QA RT19 WF Dept B only) suspended ~10:40 UTC for 1 min and reactivated · tickets #4280, #4286, #4288, #4289',
 panels:[card('2973-api-card.png',C['2973'],['PASS','PASS','PASS','PASS','INFO','INFO']),
  {img:'2973-1-exec-susp-in-dept.png',caption:"Execution History #4289 (agent in the department, suspended): Owner Assignment Skipped \"the agent is not an active agent of the ticket's department.\"",crop:EX,boxes:[{b:ROW,n:4,kind:'PASS'}]}],
 rows:[[1,'Agent not in the department (active and suspended)','Refused like manual assign, reason shown',"Owner kept; Skipped \"not an agent of the ticket's department\"",'PASS'],
  [2,'Agent in the department, suspended','Refused, reason shown',"Owner kept; Skipped \"not an active agent of the ticket's department\" (ticket 3 s after suspension)",'PASS'],
  [3,'Control: active agent in the department','Assigned','Succeeded','PASS'],[4,'Label','Failed','Skipped with the reason (dev design, same as NDC-2966)','INFO']]});
W(2966,{priority:'medium',title:'Workflow Rules | "Send happiness email" is logged as Succeeded while ratings are off',verdict:'PASS',
 env:'NDC-Staging · staging-desk · owner · Customer Happiness off (tenant) for #4293; on but scoped to QA RT19 WF Dept B for #4314 (happiness.lock held, restored, diff none)',
 panels:[card('2966-api-card.png',C['2966'],['PASS','PASS','INFO']),
  {img:'2966-1-exec-off.png',caption:'Execution History #4293: Send happiness email Skipped "Not sent: customer happiness ratings are switched off."',crop:EX,boxes:[{b:ROW,n:1,kind:'PASS'}]}],
 rows:[[1,'Ratings off','Skipped, reason "ratings are off"','Skipped "Not sent: customer happiness ratings are switched off."','PASS'],
  [2,'Ratings on, department not collecting','Reason shown',"Skipped \"Not sent: the ticket's department does not collect ratings.\"",'PASS'],[3,'Settings restored','—','diff none','INFO']]});
