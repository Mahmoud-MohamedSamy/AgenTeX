const fs=require('fs');const ENV=x=>'NDC-Staging · staging-desk · ndc-staging-owner · '+x;
const W=(n,o)=>fs.writeFileSync('specs/NDC-'+n+'.json',JSON.stringify({out:`NDC-${n}-retest-${o.verdict}.png`,ticket:'NDC-'+n,priority:o.priority,title:o.title,verdict:o.verdict,env:ENV(o.env),date:'15 Nov 2026',panels:o.panels,rows:o.rows},null,1));
const card=(n,boxes,cap,kinds)=>({img:n+'-api-card.png',caption:cap,crop:[0,0,1600,boxes[boxes.length-1][3]+30],boxes:boxes.map((b,i)=>({b,n:i+1,kind:kinds?kinds[i]:'PASS'}))});
W(2962,{priority:'high',verdict:'PARTIAL',title:'Workflow Rules | Webhook headers with line breaks or reserved names are now refused at save; what is sent not checked',env:'Workflow Rules API · QA AO Dept A · rules saved inactive',
 panels:[card(2962,[[36,99,1564,157],[36,167,1564,225],[36,235,1564,293],[36,303,1564,361],[36,371,1564,408],[36,418,1564,455],[36,465,1564,502],[36,512,1564,570]],'POST/PATCH /workflow/rules with the ticket\'s payloads and more',['PASS','PASS','PASS','PASS','PASS','PASS','PASS','INFO'])],
 rows:[[1,'Header value a + CRLF + Injected: 1','Refused at save','400 "Webhook header \'X-QA\' cannot contain a line break or another control character."','PASS'],
 [2,'Header value with LF only','Refused','400, same message','PASS'],
 [3,'Header name with CRLF','Refused','400 "header name … may hold only letters, digits and - _ . ! # $ % & \' * + ^ ` | ~."','PASS'],
 [4,'Reserved headers Host, Content-Length, Transfer-Encoding, Connection','Refused','400 each "… is set by the request itself and cannot be changed."','PASS'],
 [5,'Non-ASCII value (café)','Refused (developer note)','400 "can hold only ASCII letters, digits, spaces and symbols."','PASS'],
 [6,'Ordinary header X-QA-Ordinary','Still saves','201; value shown masked "********" on GET','PASS'],
 [7,'Edit an existing rule to a CRLF header','Refused','PATCH 400, same message; stored header unchanged','PASS'],
 [8,'Only the configured headers are sent','One x-qa header at the receiver','BLOCKED: original run used public webhook.site; no private receiver reachable from staging. No old rule with a bad header exists','INFO']]});
W(2963,{priority:'high',verdict:'PASS',title:'Workflow Rules | Script in an Add Comment body no longer runs when the rule is opened',env:'rules "QA RT18 WF 2963" + "2963b" (saved through the API, inactive) · editor, Edge 1600 px',
 panels:[{img:'2963-3-editor-body-a.png',caption:'Rule saved with commentBody <img src=x onerror="window.__xss=1">, opened in the editor',crop:[368,470,500,370],boxes:[{b:[522,762,838,812],n:1,kind:'PASS'},{b:[522,762,838,812],n:3,kind:'INFO'}]},
 {img:'2963-4-editor-body-b.png',caption:'Rule 2963b: svg onload, javascript: link, iframe, onmouseover, <script> in the body',crop:[368,180,500,380],boxes:[{b:[522,312,838,542],n:2,kind:'PASS'}]}],
 rows:[[1,'Open the rule whose comment is <img src=x onerror=…>','No script runs','Editor shows the image without onerror (innerHTML <img src="x">); window.__xss undefined; no dialog','PASS'],
 [2,'Other vectors (svg onload, javascript: href, iframe, onmouseover after hover, <script>)','No script runs','Editor body "<svg></svg><a>QA link</a><p>QA hover</p>": handlers, href, iframe and script removed; window.__xss undefined','PASS'],
 [3,'Body shown as plain text','Plain text everywhere','INFO: the rich-text editor still renders safe HTML (a broken image icon shows); the stored body keeps the raw payload','INFO']]});
W(2964,{priority:'high',verdict:'PASS',title:'Workflow Rules | Double-clicking Save & Activate now creates one rule',env:'New Rule (Tickets) via the screen · QA AO Dept A · Field Update description · rules deactivated after',
 panels:[{img:'2964-2-list-one-rule.png',caption:'After a double click on Save & Activate: search "QA RT18 WF 2964" lists one rule',crop:[292,140,1104,210],boxes:[{b:[296,274,1392,324],n:1,kind:'PASS'}]}],
 rows:[[1,'Double-click Save & Activate on a new rule','One rule','1 POST /workflow/rules (201); list shows 1 "QA RT18 WF 2964 double save"','PASS'],
 [2,'Three clicks in the same instant (script)','One rule','1 POST; 1 rule "QA RT18 WF 2964 triple click"','PASS'],
 [3,'Both rules after the test','Not left active','Both deactivated (204)','INFO']]});
W(2948,{priority:'medium',verdict:'PASS',title:'Workflow Rules | A pattern that leaves out a condition is now refused',env:'New Rule (Tickets) editor, not saved · 3 conditions',
 panels:[{img:'2948-1-pattern-1-and-2.png',caption:'3 conditions, Edit Pattern "1 and 2"',crop:[370,380,1010,450],boxes:[{b:[385,724,705,746],n:1,kind:'PASS'},{b:[494,684,758,721],n:2,kind:'PASS'}]}],
 rows:[[1,'Pattern "1 and 2" with 3 conditions','Refused with a message','"Condition 3 is not in the pattern. Use every condition number."','PASS'],
 [2,'Apply','Disabled until every number is used','Apply disabled; "(1 or 2)" also refused; "1 and 2 and 3" enables Apply','PASS'],
 [3,'Other pattern errors','Still handled','"1 and 2 and 3 and 4" → "Pattern refers to condition 4, which doesn\'t exist."','PASS'],
 [4,'Message language','—','INFO: English only (developer note); not checked in Arabic','INFO']]});
W(2951,{priority:'medium',verdict:'PASS',title:'Workflow Rules | A rule can hold several Field Update actions, and all of them run',env:'rule "QA RT18 WF 2951" (active for the test, then off) · ticket #3982',
 panels:[card(2951,[[36,99,1564,136],[36,146,1564,204],[36,214,1564,272]],'Rules API + ticket read-back')],
 rows:[[1,'Save a rule with 3 Field Updates (priority, description, classification)','Allowed (Zoho: up to 10)','201; list Actions column = 3','PASS'],
 [2,'Two Field Updates on the same field','Refused clearly','400 "Field \'description\' is set by two Field Updates at the same moment. Set it in one of them."','PASS'],
 [3,'Run on a ticket','All updates applied','#3982: priority Low→High, description "QA RT18 2951 second FU", classification Problem; execution Fired','PASS'],
 [4,'Editor offers Field Update after the first','Offered','Not checked on screen this round (developer checked)','INFO']]});
W(2953,{priority:'medium',verdict:'PASS',title:'Workflow Rules | Field Update on Created By and other system fields is refused by the API',env:'POST /workflow/rules · QA AO Dept A',
 panels:[card(2953,[[36,99,1564,136],[36,146,1564,183],[36,193,1564,230],[36,240,1564,277],[36,287,1564,324]],'Rules API')],
 rows:[[1,'Field Update created_by','Refused like ticket_number','422 "Field \'created_by\' is read-only and cannot be changed."','PASS'],
 [2,'modified_by','Refused','422, same message','PASS'],[3,'created_at / modified_at','Refused','422, same message','PASS'],
 [4,'ticket_number (control)','Refused','422 (unchanged)','PASS'],[5,'subject (control)','Saves','201','PASS']]});
W(2958,{priority:'medium',verdict:'PASS',title:'Workflow Rules | ${recordId} and ${moduleId} are now filled in a Field Update',env:'rule "QA RT18 WF 2958" (active for the test, then off) · ticket #3983',
 panels:[card(2958,[[36,99,1564,157],[36,167,1564,204],[36,214,1564,272]],'Rule + ticket read-back')],
 rows:[[1,'Rule On Create: Description = R[${recordId}] M[${moduleId}] S[${subject}]','Saves','201','PASS'],
 [2,'Create matching ticket','Rule fires','#3983, execution Fired','PASS'],
 [3,'Description of the ticket','Placeholders replaced','"R[17ca3589-…] M[88e8ea44-…] S[QA RT18 WF 2958 ticket]" = ticket id + Tickets module id','PASS']]});
W(2965,{priority:'medium',verdict:'PASS',title:'Workflow Rules | A stale save in the editor is refused with a reload prompt; the other change is kept',env:'rule "QA RT18 WF 2958" (inactive) opened in two tabs of the owner session',
 panels:[{img:'2965-3-tabA-conflict.png',caption:'Tab B renamed + saved; tab A changed the description and clicked Save',crop:[600,340,990,550],boxes:[{b:[612,354,988,546],n:2,kind:'PASS'},{b:[1158,792,1574,874],n:3,kind:'PASS'}]},
 card(2965,[[36,99,1564,136],[36,146,1564,204],[36,214,1564,272],[36,282,1564,319]],'API checks',['PASS','PASS','PASS','FAIL'])],
 rows:[[1,'Tab B: rename + Save','Saves','PATCH 200','PASS'],
 [2,'Tab A (opened before): description + Save','Told the rule changed, asked to reload','PATCH 409 → dialog "Rule changed … Reload the latest version?" (Cancel / Reload latest)','PASS'],
 [3,'No change lost','Rename kept','Toast "…changed by someone else after you opened it…"; API name "QA RT18 WF 2958 renamed in tab B"','PASS'],
 [4,'API stale save with the old version','409','409 RULE_VERSION_CONFLICT','PASS'],
 [5,'API save without any version','—','200 and the earlier rename is overwritten (version is optional for API callers)','FAIL']]});
W(2999,{priority:'medium',verdict:'PASS',title:'Workflow Rules | Owner Assignment now refuses "x" and ids that do not exist',env:'POST /workflow/rules · QA AO Dept A · saved controls inactive',
 panels:[card(2999,[[36,99,1564,157],[36,167,1564,204],[36,214,1564,251],[36,261,1564,298],[36,308,1564,345],[36,355,1564,413]],'Rules API',['PASS','PASS','PASS','PASS','PASS','INFO'])],
 rows:[[1,'RoleRoundRobin "x"','Refused','400 "Owner Assignment needs the id of the user, profile, role or team to assign."','PASS'],
 [2,'RoleRoundRobin 11111111-…-555555555555','Refused','400 "The profile to assign in turn does not exist."','PASS'],
 [3,'SpecificUser "x" / unknown user id','Refused','400 / 400 "The user to assign does not exist."','PASS'],
 [4,'Team unknown id','Refused','400 "The team to assign does not exist."','PASS'],
 [5,'Real user / profile / team','Saves','201 / 201 / 201','PASS'],
 [6,'RoleRoundRobin with a role (org unit CEO) id','—','400 "profile … does not exist": this kind takes a profile id','INFO']]});
W(2955,{priority:'low',verdict:'PASS',title:'Workflow Rules | Rule name stops at 200 characters while typing; description shows a counter',env:'New Rule dialog + rule header (Tickets), nothing saved',
 panels:[{img:'2955-2-new-rule-desc.png',caption:'Typed 250 chars in Rule Name and 2004 in Description',crop:[576,590,448,200],boxes:[{b:[596,618,1004,656],n:1,kind:'PASS'},{b:[594,690,1006,780],n:2,kind:'PASS'}]},
 {img:'2955-3-header-name.png',caption:'Rule header name box: typed 220 more characters',crop:[240,60,1120,60],boxes:[{b:[290,70,1292,104],n:3,kind:'PASS'}]}],
 rows:[[1,'Type 250 chars in Rule Name (New Rule dialog)','Stops at the limit','maxlength 200, value 200 chars','PASS'],
 [2,'Type 2004 chars in Description','Stops + shows count','maxlength 2000, value 2000, counter "2000 / 2000" (starts "0 / 2000")','PASS'],
 [3,'Rule header name box','Stops at the limit','maxlength 200, value 200 chars','PASS'],
 [4,'Limit vs Zoho (50)','—','200 kept by design (developer note)','INFO']]});
W(2961,{priority:'low',verdict:'PASS',title:'Workflow Rules | Trigger column now shows field labels in English and Arabic',env:'Workflow Rules list · QA RT18 rules (inactive) + QA NDC rules',
 panels:[{img:'2961-1-list-en.png',caption:'English',crop:[292,60,1104,820],boxes:[{b:[798,126,926,212],n:1,kind:'PASS'},{b:[798,548,926,716],n:1,kind:'PASS'},{b:[798,718,926,866],n:2,kind:'PASS'}]},
 {img:'2961-2-list-ar.png',caption:'Arabic',crop:[204,60,1104,820],boxes:[{b:[630,598,742,768],n:3,kind:'PASS'},{b:[630,770,742,872],n:3,kind:'PASS'}]}],
 rows:[[1,'Date trigger on due_date (1 h before, 1 day before, 2 days after)','Field label, right plural','"Date-Field Relative: Due Date (1 hour before)", "(1 day before)", "(2 days after)"','PASS'],
 [2,'Field Changed triggers','Labels','"Field Changed: Ticket Owner", "Field Changed: Status, Priority", "Field Changed: QA NDC Related Branch"','PASS'],
 [3,'Arabic','Labels in Arabic','"تغيّر حقل: مالك التذكرة", "تاريخ الاستحقاق (يوم قبل)", "(يومان بعد)", "(ساعة قبل)"','PASS'],
 [4,'Arabic list separator','—','"الحالة, الأولوية" uses a Latin comma','INFO']]});
W(2998,{priority:'low',verdict:'PASS',title:'Workflow Rules | Date trigger on a non-date field is refused by the API',env:'POST /workflow/rules · QA AO Dept A',
 panels:[card(2998,[[36,99,1564,157],[36,167,1564,204],[36,214,1564,251],[36,261,1564,298]],'Rules API')],
 rows:[[1,'dateFieldName subject','Refused','400 "A date trigger needs a date or date-time field; \'subject\' is not one."','PASS'],
 [2,'dateFieldName priority','Refused','400, same message','PASS'],[3,'due_date','Saves','201','PASS'],[4,'nope_field','Refused','400 "Unknown field(s) for module \'Tickets\': nope_field."','PASS']]});
W(3033,{priority:'low',verdict:'PASS',title:'Ticket History | Address change now reads "City Cairo → Tanta"',env:'QA field "QA RT18 Address" (qa_rt18_address) · ticket #4053 · QA AO Dept A',
 panels:[{img:'3033-2-history-two-parts.png',caption:'Ticket #4053 › History after two address edits',crop:[664,240,936,440],boxes:[{b:[712,404,960,446],n:1,kind:'PASS'},{b:[712,302,960,366],n:2,kind:'PASS'}]}],
 rows:[[1,'Change City Cairo → Tanta','Readable line','"QA RT18 Address was updated · City Cairo → Tanta"','PASS'],
 [2,'Change Street + Zip together','Readable lines','"Street 1 QA Street → 2 QA Road", "Zip Code 11511 → 31511"; no JSON','PASS'],
 [3,'Changed through','—','Records API (owner); screen inline edit not used','INFO']]});
W(3044,{priority:'low',verdict:'BLOCKED',title:'Ticket History | Help Center reply label not retested: needs a contact sign-in',env:'Ticket History',
 panels:[card(3044,[[36,99,1564,157],[36,167,1564,225],[36,235,1564,293]],'What could be checked',['INFO','INFO','INFO'])],
 rows:[[1,'Contact replies from the Help Center','"Reply received from the Help Center"','BLOCKED: needs the contact to sign in to the Help Center (not allowed in this lane)','INFO'],
 [2,'Re-read the original entry','—','#3463 deleted at the 13 Nov cleanup','INFO'],
 [3,'Static check','—','No "Email received" / "Help Center" history text in the web bundle: label comes from elsewhere','INFO']]});
console.log(fs.readdirSync('specs').filter(f=>/29[4-9]\d|30[34]\d/.test(f)).join(' '));
